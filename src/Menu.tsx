import React, { useState } from "react";
import { Type } from "../node_modules/typescript/lib/typescript";
import styles from "./Menu.css";

const testSettings = {
  testNumber: 24,
  testString: "Placeholder",
  testBool: true,
  testColor: "#8000ff",
};

function MenuItem<T>({
  name,
  initialValue,
}: {
  name: String;
  initialValue: T;
}) {
  const [value, setValue] = useState<T>(initialValue);

  return (
    <div className={styles.menuItem}>
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

export default function Menu() {
  return (
    <div className={styles.menu}>
      {Object.entries(testSettings).map(([key, value]) => {
        return (
          <MenuItem
            name={key
              .replace(/([A-Z])/g, (match) => ` ${match}`)
              .replace(/^./, (match) => match.toUpperCase())
              .trim()}
            initialValue={value}
          ></MenuItem>
        );
      })}
    </div>
  );
}
