import React, { useContext, useEffect, useState } from "react";
import Draggable from "./Drag";
import WidgetMap from "./WidgetMap";
import { AppContext } from "./App";
import globalStyles from "./App.css";
import styles from "./Menu.css";

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
  const { setEditing, setMenuOpen, addWidget } = useContext(AppContext);

  return (
    <div className={styles.widgetList}>
      {Object.entries(WidgetMap).map(([key, value], i) => {
        const Component = value.component;
        return (
          <div
            key={i}
            className={[globalStyles.container, styles.widgetThumb].join(" ")}
            style={{
              minHeight: value.size.height * 32 * 2 + "px",
            }}
            onClick={() => {
              setEditing(true);
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
      {widgets.map((state, i) => (
        <React.Fragment key={i}>
          <span>
            {state.type.replace(/^./, (match) => match.toUpperCase())}
          </span>
          {Object.entries(state.settings).map(([key, value], i) => (
            <MenuItem
              key={i}
              name={key
                .replace(/([A-Z])/g, (match) => ` ${match}`)
                .replace(/([A-Za-z])(?=\d)/g, "$1 ")
                .replace(/^./, (match) => match.toUpperCase())
                .trim()}
              initialValue={value}
              onChange={(v) => {
                state.settings[key] = v;
                setWidgets([...widgets]);

                if (!editing) saveTemplate();
              }}
            />
          ))}
        </React.Fragment>
      ))}
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
      {![MenuTab.Widget, MenuTab.Add].includes(activeTab) && (
        <span>No Settings Available</span>
      )}
    </div>
  );
}
