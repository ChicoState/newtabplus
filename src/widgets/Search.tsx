import React, { useEffect, useState } from "react";
import Widget from "../Widget";
import styles from "./Search.css";

export function Search() {
  return (
      <form method="get" action="https://www.google.com/search" className={styles.body}>
       <input type="text" name="q" placeholder="Search Google"/>
       <input type="submit" value="Google Search"/>
      </form>
  );
}