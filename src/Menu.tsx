import React, { useContext, useEffect, useState } from "react";
import Draggable from "./Drag";
import WidgetMap from "./WidgetMap";
import { Template, AppContext } from "./App";
import globalStyles from "./App.css";
import styles from "./Menu.css";
import { XIcon, EyeIcon, PushPinIcon } from "@phosphor-icons/react";

function MenuItem<T>({
  name,
  initialValue,
  onChange,
}: {
  name: String;
  initialValue: T;
  onChange: (value: T) => void;
}) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <div className={[globalStyles.container, styles.menuItem].join(" ")}>
      <span className={styles.itemName}>{name}</span>

      <div className={styles.itemInput}>
        {typeof value === "boolean" && (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => {
              setValue(e.target.checked as T);
            }}
          ></input>
        )}

        {typeof value === "string" && (
          <input
            type={value.startsWith("#") ? "color" : "text"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value as T);
            }}
          ></input>
        )}

        {typeof value === "number" && (
          <input
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.valueAsNumber as T);
            }}
          ></input>
        )}
      </div>
    </div>
  );
}

function WidgetList() {
  const { setEditing, setDeleting, setMenuOpen, addWidget } =
    useContext(AppContext);

  return (
    <div className={styles.widgetList}>
      {Object.entries(WidgetMap).map(([key, value], i) => {
        const Component = value.component;
        return (
          <div
            key={i}
            className={[globalStyles.container, styles.widgetThumb].join(" ")}
            title={toReadableString(key)}
            style={{
              minHeight: value.size.height * 32 * 2 + "px",
            }}
            onClick={() => {
              setEditing(true);
              setDeleting(false);
              setMenuOpen(false);
              addWidget(key);
            }}
          >
            <Component {...value}></Component>
          </div>
        );
      })}
    </div>
  );
}

function WidgetSettings() {
  const { editing, widgets, setWidgets, saveTemplate } = useContext(AppContext);

  return (
    <>
      {widgets.map((state, i) => {
        if (Object.keys(state.settings).length === 0) return;

        return (
          <React.Fragment key={i}>
            <span>
              {state.type.replace(/^./, (match) => match.toUpperCase())}
            </span>
            {Object.entries(state.settings).map(([key, value], i) => (
              <MenuItem
                key={i}
                name={toReadableString(key)}
                initialValue={value}
                onChange={(v) => {
                  state.settings[key] = v;
                  setWidgets([...widgets]);

                  if (!editing) saveTemplate();
                }}
              />
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
}

function ThemeSettings() {
  const [blurAmount, setBlurAmount] = useState(() => {
    return Number(localStorage.getItem("theme_blurAmount")) || 0;
  });
  const [backgroundColor, setBackgroundColor] = useState(() => {
    return localStorage.getItem("theme_backgroundColor") || "#ffffff";
  });
  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem("theme_font") || "";
  });
  const [lightMode, setLightMode] = useState(() => {
    const lightModeStored = localStorage.getItem("theme_lightMode");
    const darkModeStored = localStorage.getItem("theme_darkMode");

    // If neither mode has been set, default to light mode
    if (lightModeStored === null && darkModeStored === null) {
      localStorage.setItem("theme_lightMode", "true");
      return true;
    }
    return lightModeStored === "true";
  });
  const [darkMode, setDarkMode] = useState(() => {
    const darkModeStored = localStorage.getItem("theme_darkMode");
    // Only return true if explicitly set to true
    return darkModeStored === "true";
  });

  const fontOptions = ["Arial", "Times New Roman", "Georgia", "Courier New", "Verdana"];

  const handleBlurChange = (value: number) => {
    setBlurAmount(value);
    localStorage.setItem("theme_blurAmount", value.toString());
  };

  const handleBackgroundColorChange = (value: string) => {
    setBackgroundColor(value);
    localStorage.setItem("theme_backgroundColor", value);
  };

  const handleFontChange = (value: string) => {
    setSelectedFont(value);
    localStorage.setItem("theme_font", value);
  };

  const handleLightModeChange = (value: boolean) => {
    if (value) {
      setLightMode(true);
      setDarkMode(false);
      localStorage.setItem("theme_lightMode", "true");
      localStorage.setItem("theme_darkMode", "false");
    } else {
      setLightMode(false);
      localStorage.setItem("theme_lightMode", "false");
    }
  };

  const handleDarkModeChange = (value: boolean) => {
    if (value) {
      setDarkMode(true);
      setLightMode(false);
      localStorage.setItem("theme_darkMode", "true");
      localStorage.setItem("theme_lightMode", "false");
    } else {
      setDarkMode(false);
      localStorage.setItem("theme_darkMode", "false");
    }
  };

  return (
    <>
      <span>Themes</span>

      <div className={[globalStyles.container, styles.menuItem].join(" ")}>
        <span className={styles.itemName}>Blur ({blurAmount}%)</span>
        <div className={styles.itemInput}>
          <input
            type="range"
            min="0"
            max="100"
            value={blurAmount}
            onChange={(e) => handleBlurChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className={[globalStyles.container, styles.menuItem].join(" ")}>
        <span className={styles.itemName}>Background Color</span>
        <div className={styles.itemInput}>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => handleBackgroundColorChange(e.target.value)}
          />
        </div>
      </div>

      <div className={[globalStyles.container, styles.menuItem].join(" ")}>
        <span className={styles.itemName}>Fonts</span>
        <div className={styles.itemInput}>
          <select
            value={selectedFont}
            onChange={(e) => handleFontChange(e.target.value)}
            style={{ fontFamily: selectedFont || "inherit" }}
          >
            <option value="">None</option>
            {fontOptions.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>

      <MenuItem
        name="Light Mode"
        initialValue={lightMode}
        onChange={handleLightModeChange}
      />
      <MenuItem
        name="Dark Mode"
        initialValue={darkMode}
        onChange={handleDarkModeChange}
      />
    </>
  );
}

function TemplateList() {
  const {
    templates,
    activeTemplate,
    saveTemplate,
    loadTemplate,
    setTemplates,
  } = useContext(AppContext);
  const [visibleImage, setVisibleImage] = useState(null);

  return (
    <>
      {templates.map((template, i) => {
        const isActive = i === activeTemplate;
        const showImage = i === visibleImage;

        return (
          <div
            className={[
              globalStyles.container,
              styles.templateItem,
              isActive ? styles.active : "",
            ].join(" ")}
            onClick={() => {
              console.log(`Loading template ${template.name}`);
              loadTemplate(i);
            }}
            key={i}
          >
            <div
              className={[
                showImage ? globalStyles.container : "",
                styles.templateHeader,
              ].join(" ")}
            >
              <span className={styles.itemName}>
                {template.name || "Untitled"}
              </span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  className={[globalStyles.container, globalStyles.button].join(
                    " ",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showImage) setVisibleImage(null);
                    else setVisibleImage(i);
                  }}
                >
                  <EyeIcon size={14} weight={"bold"}></EyeIcon>
                </button>

                <button
                  className={[globalStyles.container, globalStyles.button].join(
                    " ",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    template.pinned = !template.pinned;
                    setTemplates([...templates]);
                  }}
                >
                  {template.pinned ? (
                    <PushPinIcon size={14} weight={"fill"}></PushPinIcon>
                  ) : (
                    <PushPinIcon size={14} weight={"bold"}></PushPinIcon>
                  )}
                </button>

                <button
                  className={[globalStyles.container, globalStyles.button].join(
                    " ",
                  )}
                >
                  <XIcon size={14} weight={"bold"}></XIcon>
                </button>
              </div>
            </div>
            {showImage && (
              <img src={template.image} style={{ zoom: 0.5 }}></img>
            )}
          </div>
        );
      })}
      <button
        className={[
          globalStyles.container,
          globalStyles.button,
          styles.saveButton,
        ].join(" ")}
        onClick={() => {
          saveTemplate("New Template");
        }}
      >
        Save Template
      </button>
    </>
  );
}

enum MenuTab {
  Widget,
  Add,
  General,
  Theme,
  Template,
}

export default function Menu({ active }: { active: boolean }) {
  const appContext = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<MenuTab>(MenuTab.Widget);

  return (
    <div
      className={[
        globalStyles.container,
        styles.menu,
        active ? styles.active : "",
      ].join(" ")}
    >
      <div className={[globalStyles.container, styles.header].join(" ")}>
        {Object.entries(MenuTab)
          .filter(([k, v]) => isNaN(Number(k)))
          .map(([key, value], i) => {
            return (
              <button
                key={i}
                className={[
                  styles.headerTab,
                  activeTab === (value as MenuTab) ? styles.active : "",
                ].join(" ")}
                onClick={() => setActiveTab(value as MenuTab)}
              >
                {key}
              </button>
            );
          })}
      </div>
      {activeTab === MenuTab.Widget && <WidgetSettings></WidgetSettings>}
      {activeTab === MenuTab.Add && active && <WidgetList></WidgetList>}
      {activeTab === MenuTab.Theme && <ThemeSettings></ThemeSettings>}
      {activeTab === MenuTab.Template && <TemplateList></TemplateList>}
      {![MenuTab.Widget, MenuTab.Add, MenuTab.Theme, MenuTab.Template].includes(activeTab) && (
        <span>No Settings Available</span>
      )}
    </div>
  );
}

function toReadableString(str: string) {
  return str
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/([A-Za-z])(?=\d)/g, "$1 ")
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
}
