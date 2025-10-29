import React, { useEffect, useState } from "react";
import { WidgetState } from "../Widget";
import { LinkIcon } from "@phosphor-icons/react";
import globalStyles from "../App.css";
import styles from "./Shortcut.css";

export interface ShortcutSettings {
  website: string;
  openInNewTab: boolean;
}

export function Shortcut({ settings }: WidgetState<ShortcutSettings>) {
  const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   setLoaded(false);
  // }, [url]);

  return (
    <a
      className={[globalStyles.container, styles.shortcut].join(" ")}
      href={settings.website}
      title={settings.website}
      target={settings.openInNewTab ? "_blank" : "_self"}
    >
      {!loaded && <LinkIcon className={styles.icon} weight="bold"></LinkIcon>}
      <img
        className={styles.icon}
        src={settings.website + "/favicon.ico"}
        style={{
          display: loaded ? "initial" : "none",
        }}
        onLoad={() => {
          setLoaded(true);
        }}
      ></img>
    </a>
  );
}
