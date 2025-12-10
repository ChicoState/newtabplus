import React, { useState } from "react";
import styles from "./themeOpenPage.css";
import { CaretLeftIcon, CaretRightIcon, Sun, Moon } from "@phosphor-icons/react";

type Props = { 
    onContinue:()=>void 
};

function OpeningTheme({ onContinue }: Props) {
    const themes = ["Blur","Fonts","Light/Dark mode"];
    const fontOptions = ["Arial", "Times New Roman", "Georgia", "Courier New", "Verdana"];
    const [index, setIndex] = React.useState(0);
    const n = themes.length;
    const left  = (index - 1 + n) % n;
    const right = (index + 1) % n;
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [lightDarkMode, setLightDarkMode] = useState<Map<number, 'light' | 'dark' | null>>(new Map());
    const [selectedFont, setSelectedFont] = useState<string | null>(null);
    const [blurAmount, setBlurAmount] = useState(50);
    const [showError, setShowError] = useState(false);
    const isSelected = (i: number) => selected.has(i);

    const toggle = (i: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            const wasSelected = next.has(i);
            next.has(i) ? next.delete(i) : next.add(i);

            // Save blur setting when toggled
            if (themes[i] === "Blur") {
                if (!wasSelected) {
                    localStorage.setItem("theme_blurAmount", blurAmount.toString());
                } else {
                    localStorage.setItem("theme_blurAmount", "0");
                }
            }

            return next;
        });
    };

    const toggleLightDark = (i: number, mode: 'light' | 'dark') => {
        setLightDarkMode(prev => {
            const next = new Map(prev);
            const current = next.get(i);
            if (current === mode) {
                next.delete(i);
                setSelected(prev => {
                    const nextSelected = new Set(prev);
                    nextSelected.delete(i);
                    return nextSelected;
                });
                // Clear both mode settings
                localStorage.setItem("theme_lightMode", "false");
                localStorage.setItem("theme_darkMode", "false");
            } else {
                next.set(i, mode);
                setSelected(prev => new Set(prev).add(i));
                // Save the selected mode
                if (mode === 'light') {
                    localStorage.setItem("theme_lightMode", "true");
                    localStorage.setItem("theme_darkMode", "false");
                } else {
                    localStorage.setItem("theme_darkMode", "true");
                    localStorage.setItem("theme_lightMode", "false");
                }
            }
            return next;
        });
    };

    const toggleFont = (i: number, font: string) => {
        if (selectedFont === font) {
            setSelectedFont(null);
            setSelected(prev => {
                const nextSelected = new Set(prev);
                nextSelected.delete(i);
                return nextSelected;
            });
            localStorage.setItem("theme_font", "");
        } else {
            setSelectedFont(font);
            setSelected(prev => new Set(prev).add(i));
            localStorage.setItem("theme_font", font);
        }
    };

    const handleContinue = () => {
        if (selected.size === 0) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000); // Hide after 3 seconds
        } else {
            onContinue();
        }
    };

    // helper to build the class string for each tile
    const tileClass = (i: number, extra = "") =>[styles.themeOptions,extra,
        themes[i] === "Blur" ? styles.blurTileBg : "",
        themes[i] === "Fonts" ? styles.fontsTile : "",
        themes[i] === "Light/Dark mode" ? styles.lightDarkSplit : "",
        isSelected(i) && themes[i] === "Blur" ? styles.selected : "",
        themes[i] === "Light/Dark mode" && lightDarkMode.has(i) ? styles.lightDarkSelected : "",
        themes[i] === "Fonts" && selectedFont ? styles.fontSelected : "",].join(" ").trim();

    // Render the Blur theme with slider
    const renderBlurTheme = (i: number) => {
        return (
            <div className={styles.blurContainer}>
                <div className={styles.blurLabel}>Blur Amount: {blurAmount}%</div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={blurAmount}
                    className={styles.blurSlider}
                    onChange={(e) => {
                        e.stopPropagation();
                        setBlurAmount(Number(e.target.value));
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    className={styles.selectButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggle(i);
                    }}
                >
                    {isSelected(i) ? "Selected" : "Select"}
                </button>
            </div>
        );
    };

    // Render the Fonts theme
    const renderFontsTheme = (i: number) => {
        return (
            <div className={styles.fontsContainer}>
                <div className={styles.fontsLabel}>Select Font:</div>
                <select
                    className={styles.fontDropdown}
                    value={selectedFont || ""}
                    onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.value) {
                            toggleFont(i, e.target.value);
                        }
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <option value="">Choose a font...</option>
                    {fontOptions.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    // Render the Light/Dark mode split theme
    const renderLightDarkTheme = (i: number) => {
        const selectedMode = lightDarkMode.get(i);
        return (
            <div className={styles.splitContainer}>
                <div
                    className={`${styles.lightSide} ${selectedMode === 'light' ? styles.selectedSide : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleLightDark(i, 'light');
                    }}
                >
                    <div className={styles.iconWrapper}>
                        <Sun weight="fill" />
                    </div>
                    <div className={styles.modeLabel}>Light mode</div>
                </div>
                <div
                    className={`${styles.darkSide} ${selectedMode === 'dark' ? styles.selectedSide : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleLightDark(i, 'dark');
                    }}
                >
                    <div className={styles.iconWrapper}>
                        <Moon weight="fill" />
                    </div>
                    <div className={styles.modeLabel}>Dark mode</div>
                </div>
            </div>
        );
    };

    // Helper to render theme content
    const renderThemeContent = (i: number) => {
        if (themes[i] === "Blur") {
            return renderBlurTheme(i);
        }
        if (themes[i] === "Fonts") {
            return renderFontsTheme(i);
        }
        if (themes[i] === "Light/Dark mode") {
            return renderLightDarkTheme(i);
        }
        return themes[i];
    };

    return (
        <div className={styles.openingTheme}>
            <p className={styles.welcome}>Welcome</p>
            <p className={styles.chooseTheme}>Choose your themes!</p>

            <div className={styles.optionsRow}>
                <button className={`${styles.navButton} ${styles.navPrev}`} aria-label="Previous theme" onClick={() => setIndex(left)}><CaretLeftIcon weight="bold" size={20} /> </button>
                <button className={tileClass(left, styles.side)} onClick={() => {}} aria-pressed={isSelected(left)}>{renderThemeContent(left)}</button>
                <button className={tileClass(index)} onClick={() => {}} aria-pressed={isSelected(index)}>{renderThemeContent(index)}</button>
                <button className={tileClass(right, styles.side)} onClick={() => {}} aria-pressed={isSelected(right)}>{renderThemeContent(right)}</button>
                <button className={`${styles.navButton} ${styles.navNext}`} aria-label="Next theme" onClick={() => setIndex(right)}><CaretRightIcon weight="bold" size={20} /></button>
            </div>

            <div className={styles.progressDots}>
                {themes.map((_, i) => (
                    <div key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
                ))}
            </div>

            {showError && (
                <div className={styles.errorMessage}>
                    Please select at least one theme
                </div>
            )}

            <div className={styles.bottomRow}>
                <button className={styles.actionButton} onClick={handleContinue}>Continue</button>
                <button className={styles.actionButton} onClick={onContinue}>Skip</button>
            </div>
        </div>
    );
}
export default OpeningTheme;