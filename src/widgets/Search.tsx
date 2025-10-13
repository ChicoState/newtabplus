import React, { useEffect, useState } from "react";
import Widget from "../Widget";
import styles from "./Search.css";
import globalStyles from "../App.css";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export function Search() {
  return (
    <form
      method="get"
      action="https://www.google.com/search"
      className={styles.body}
    >
      <div className={[globalStyles.container, styles.bar].join(" ")}>
        <MagnifyingGlassIcon
          size={24}
          color={"#fff4"}
          weight="bold"
        ></MagnifyingGlassIcon>
        <input
          className={styles.searchInput}
          type="text"
          name="q"
          placeholder="Search for something"
        />
        <button
          className={[globalStyles.container, styles.searchButton].join(" ")}
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
