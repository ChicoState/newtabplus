import React, { useContext, useEffect, useState } from "react";
import { Type } from "../node_modules/typescript/lib/typescript";
import globalStyles from "./App.css";
import styles from "./Menu.css";
import { AppContext } from "./App";
import { Draggable } from "./Drag";
import { WidgetMap } from "./WidgetMap";

const testSettings = {
  testNumber: 24,
  testString: "Placeholder",
  testBool: true,
  testColor: "#8000ff",
};

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
  const appContext = useContext(AppContext);

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
          >
            <Draggable
              onDrag={() => {
                appContext.setEditing(true);
                appContext.setMenuOpen(false);
              }}
            >
              <Component {...value}></Component>
            </Draggable>
          </div>
        );
      })}
    </div>
  );
}

function WidgetSettings() {
  const { widgets, setWidgets } = useContext(AppContext);

  return (
    <>
      {widgets.map((state) => {
        return Object.entries(state.settings).map(([key, value], i) => {
          return (
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
              }}
            ></MenuItem>
          );
        });
      })}
    </>
  );
}

export default function Menu({ active }: { active: boolean }) {
  const appContext = useContext(AppContext);

  return (
    <div
      className={[
        globalStyles.container,
        styles.menu,
        active ? styles.active : "",
      ].join(" ")}
    >
      {!appContext.editing && <WidgetList></WidgetList>}
      {appContext.editing && <WidgetSettings></WidgetSettings>}
    </div>
  );
}
