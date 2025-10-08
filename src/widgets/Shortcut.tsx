import React, { useEffect, useState } from "react";
import Widget from "../Widget";
import { LinkIcon } from "@phosphor-icons/react";
import styles from "./Shortcut.css";

export default function Shortcut({ url = "" }: { url?: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [url]);

  return (
    <Widget size={{ width: 1, height: 1 }} resizeable={false}>
      <a className={styles.shortcut} href={url} title={url}>
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
    </Widget>
  );
}
