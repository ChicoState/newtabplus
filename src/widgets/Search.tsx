import React, { useEffect, useState } from "react";
import Widget, { WidgetState } from "../Widget";
import styles from "./Search.css";
import globalStyles from "../App.css";
import { MagnifyingGlassIcon, ArrowRightIcon } from "@phosphor-icons/react";

export interface SearchSettings {
  showIcon: boolean;
  showButton: boolean;
}

export function Search({ settings }: WidgetState<SearchSettings>) {
  return (
    <form
      method="get"
      action="https://www.google.com/search"
      className={styles.body}
    >
      <div className={[globalStyles.container, styles.bar].join(" ")}>
        {settings.showIcon && (
          <MagnifyingGlassIcon
            size={18}
            color={"#fff4"}
            weight="bold"
          ></MagnifyingGlassIcon>
        )}
        <input
          className={styles.searchInput}
          type="text"
          name="q"
          placeholder="Search for something"
        />
        {settings.showButton && (
          <button
            className={[globalStyles.container, styles.searchButton].join(" ")}
            type="submit"
          >
            <ArrowRightIcon
              size={18}
              color={"#fff8"}
              weight="bold"
            ></ArrowRightIcon>
          </button>
        )}
      </div>
    </form>
  );
}
