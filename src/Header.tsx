import React, { useContext, useState } from "react";
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
  EyeIcon,
  EyeClosedIcon,
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
    hidden,
    setEditing,
    setDeleting,
    setHidden,
    menuOpen,
    setMenuOpen,
    saveTemplate,
    loadTemplate,
    templates,
  } = useContext(AppContext);

  return (
    <div className={styles.header}>
      <div className={styles.row}>
        {templates.map((template, i) => {
          if (template.pinned) {
            return (
              <button
                className={[styles.container, styles.button].join(" ")}
                onClick={() => {
                  loadTemplate(i);
                }}
              >
                {template.name}
              </button>
            );
          }
        })}
      </div>
      <div className={styles.row}>
        {!editing && (
          <button
            className={[styles.container, styles.button].join(" ")}
            onClick={() => {
              setHidden(false);
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
          style={{ padding: "6px" }}
          onClick={() => {
            setHidden(!hidden);
          }}
        >
          {hidden ? (
            <EyeClosedIcon weight="bold"></EyeClosedIcon>
          ) : (
            <EyeIcon weight="bold"></EyeIcon>
          )}
        </button>
      </div>
    </div>
  );
}
