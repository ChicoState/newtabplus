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
                    setTemplates(structuredClone(templates));
                  }}
                >
                  {template.pinned ? (
                    <PushPinIcon size={14} weight={"fill"}></PushPinIcon>
                  ) : (
                    <PushPinIcon size={14} weight={"bold"}></PushPinIcon>
                  )}
                </button>

                {/*<button
                  className={[globalStyles.container, globalStyles.button].join(
                    " ",
                  )}
                >
                  <XIcon size={14} weight={"bold"}></XIcon>
                </button>*/}
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
  Templates,
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
      {activeTab === MenuTab.Templates && <TemplateList></TemplateList>}
      {![MenuTab.Widget, MenuTab.Add, MenuTab.Templates].includes(
        activeTab,
      ) && <span>No Settings Available</span>}
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
