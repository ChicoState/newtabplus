import React, { useEffect, useState } from "react";
import Widget from "../Widget";
import { LinkIcon } from "@phosphor-icons/react";
import globalStyles from "../App.css";
import styles from "./Shortcut.css";

export function Shortcut({ url = "" }: { url?: string }) {
  const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   setLoaded(false);
  // }, [url]);

  return (
    <a
      className={[globalStyles.container, styles.shortcut].join(" ")}
      href={url}
      title={url}
    >
      {!loaded && <LinkIcon className={styles.icon} weight="bold"></LinkIcon>}
      <img
        className={styles.icon}
        src={url + "/favicon.ico"}
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
