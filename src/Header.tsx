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
  EraserIcon,
  ArrowsOutCardinalIcon,
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
    editing,
    deleting,
    setEditing,
    setDeleting,
    menuOpen,
    setMenuOpen,
    saveTemplate,
    loadTemplate,
    templates,
  } = useContext(AppContext);

  return (
    <div className={styles.header}>
      <div className={styles.row}>
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
              setDeleting(!deleting);
            }}
          >
            {deleting ? (
              <ArrowsOutCardinalIcon weight="bold"></ArrowsOutCardinalIcon>
            ) : (
              <EraserIcon weight="bold"></EraserIcon>
            )}
            {deleting ? "Move" : "Delete"}
          </button>
        )}

        {editing && (
          <button
            className={[styles.container, styles.button].join(" ")}
            onClick={() => {
              loadTemplate();
              setEditing(false);
              setDeleting(false);
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
              saveTemplate();
              setEditing(false);
              setDeleting(false);
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

        <button
          className={[styles.container, styles.button].join(" ")}
          onClick={() => {
            console.log(templates);
          }}
        >
          <WrenchIcon weight="bold"></WrenchIcon>
          Debug
        </button>
      </div>
    </div>
  );
}
