import React, { useState } from "react";
import styles from "./themeOpenPage.css";
import { CaretLeftIcon, CaretRightIcon, Sun, Moon } from "@phosphor-icons/react";

type Props = { 
    onContinue:()=>void 
};

function OpeningTheme({ onContinue }: Props) {
    const themes = ["Blur","Color background","Fonts","Light/Dark mode"];
    const fontOptions = ["Arial", "Times New Roman", "Georgia", "Courier New", "Verdana"];
    const [index, setIndex] = React.useState(0);
    const n = themes.length;
    const left  = (index - 1 + n) % n;
    const right = (index + 1) % n;
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [lightDarkMode, setLightDarkMode] = useState<Map<number, 'light' | 'dark' | null>>(new Map());
    const [selectedFont, setSelectedFont] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const isSelected = (i: number) => selected.has(i);

    const toggle = (i: number) => setSelected(prev => {
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
        });

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
            } else {
                next.set(i, mode);
                setSelected(prev => new Set(prev).add(i));
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
        } else {
            setSelectedFont(font);
            setSelected(prev => new Set(prev).add(i));
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
        themes[i] === "Color background" ? styles.colorBg : "",
        themes[i] === "Blur" ? styles.blurTile : "",
        themes[i] === "Fonts" ? styles.fontsTile : "",
        themes[i] === "Light/Dark mode" ? styles.lightDarkSplit : "",
        isSelected(i) && themes[i] !== "Light/Dark mode" && themes[i] !== "Fonts" ? styles.selected : "",
        themes[i] === "Light/Dark mode" && lightDarkMode.has(i) ? styles.lightDarkSelected : "",
        themes[i] === "Fonts" && selectedFont ? styles.fontSelected : "",].join(" ").trim();

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
        if (themes[i] === "Light/Dark mode") {
            return renderLightDarkTheme(i);
        }
        if (themes[i] === "Fonts") {
            return renderFontsTheme(i);
        }
        return themes[i];
    };

    return (
        <div className={styles.openingTheme}>
            <p className={styles.welcome}>Welcome</p>
            <p className={styles.chooseTheme}>Choose a theme</p>

            <div className={styles.optionsRow}>
                <button className={`${styles.navButton} ${styles.navPrev}`} aria-label="Previous theme" onClick={() => setIndex(left)}><CaretLeftIcon weight="bold" size={20} /> </button>
                <button className={tileClass(left, styles.side)} onClick={() => themes[left] !== "Light/Dark mode" && themes[left] !== "Fonts" && toggle(left)} aria-pressed={isSelected(left)}>{renderThemeContent(left)}</button>
                <button className={tileClass(index)} onClick={() => themes[index] !== "Light/Dark mode" && themes[index] !== "Fonts" && toggle(index)} aria-pressed={isSelected(index)}>{renderThemeContent(index)}</button>
                <button className={tileClass(right, styles.side)} onClick={() => themes[right] !== "Light/Dark mode" && themes[right] !== "Fonts" && toggle(right)} aria-pressed={isSelected(right)}>{renderThemeContent(right)}</button>
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