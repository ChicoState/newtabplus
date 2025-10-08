import React, { useEffect, useState } from "react";
import Widget from "../Widget";
import styles from "./Note.css";

export function Note() {
  return (
    <div className={styles.body}>
        <textarea></textarea>
    </div>
  );
}