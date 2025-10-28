import React, { useContext } from "react";
import { AppContext } from "./App";
import styles from "./App.css";

import {
  Icon,
  PencilSimpleIcon,
  CheckIcon,
  XIcon,
  ListIcon,
  WrenchIcon,
} from "@phosphor-icons/react";

function HeaderButton({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon: Icon;
  onClick: () => void;
}) {}

export default function Header() {
  const {
    widgets,
    editing,
    setEditing,
    menuOpen,
    setMenuOpen,
    saveTemplate,
    loadTemplate,
    addWidget,
  } = useContext(AppContext);

  return (
    <div className={styles.header}>
      <div className={styles.row}>
        <button
          className={[styles.container, styles.button].join(" ")}
          onClick={() => {
            console.table(widgets);
            addWidget("clock");
          }}
        >
          <WrenchIcon weight="bold"></WrenchIcon>
          Debug
        </button>

        {!editing && (
          <button
            className={[styles.container, styles.button].join(" ")}
            onClick={() => {
              setEditing(true);
            }}
          >
            <PencilSimpleIcon weight="bold"></PencilSimpleIcon>
            Edit
          </button>
        )}

        {editing && (
          <button
            className={[styles.container, styles.button].join(" ")}
            onClick={() => {
              setEditing(false);
              loadTemplate();
            }}
          >
            <XIcon weight="bold"></XIcon>
            Cancel
          </button>
        )}

        {editing && (
          <button
            className={[styles.container, styles.button].join(" ")}
            onClick={() => {
              setEditing(false);
              saveTemplate();
            }}
          >
            <CheckIcon weight="bold"></CheckIcon>
            Done
          </button>
        )}

        <button
          className={[styles.container, styles.button].join(" ")}
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          <ListIcon weight="bold"></ListIcon>
          Settings
        </button>
      </div>
    </div>
  );
}
