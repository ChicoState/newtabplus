import React, { useContext, useEffect, useState } from "react";
import { Type } from "../node_modules/typescript/lib/typescript";
import globalStyles from "./App.css";
import styles from "./Menu.css";
import { AppContext } from "./App";

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

export default function Menu({ active }: { active: boolean }) {
  const { widgets, setWidgets } = useContext(AppContext);

  return (
    <div
      className={[
        globalStyles.container,
        styles.menu,
        active ? styles.active : "",
      ].join(" ")}
    >
      {widgets.map((state, i) => {
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
    </div>
  );
}
