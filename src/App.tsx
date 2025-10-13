import React, { useState } from "react";
import Widget from "./Widget";
import Menu from "./Menu";
import { Grid } from "./Grid";
import { Weather } from "./widgets/Weather";
import { Clock } from "./widgets/Clock";
import { Search } from "./widgets/Search";
import styles from "./App.css";
import {
  PencilSimpleIcon,
  CheckIcon,
  XIcon,
  ListIcon,
} from "@phosphor-icons/react";

const TestBox = () => {
  return <div className={styles.container}></div>;
};

const App = () => {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.row}>
          {editing && (
            <button
              className={[styles.container, styles.button].join(" ")}
              onClick={() => {
                setEditing(!editing);
              }}
            >
              <XIcon weight="bold"></XIcon>
              Cancel
            </button>
          )}

          <button
            className={[styles.container, styles.button].join(" ")}
            onClick={() => {
              setEditing(!editing);
            }}
          >
            {editing && <CheckIcon weight="bold"></CheckIcon>}
            {!editing && <PencilSimpleIcon weight="bold"></PencilSimpleIcon>}
            {editing ? "Done" : "Edit"}
          </button>

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

      <Grid width={24} height={12} editing={editing}>
        <Widget
          size={{ width: 4, height: 2 }}
          position={{ gridX: 10, gridY: 1 }}
        >
          <Clock></Clock>
        </Widget>

        <Widget
          size={{ width: 8, height: 1 }}
          position={{ gridX: 8, gridY: 3 }}
        >
          <Search></Search>
        </Widget>

        <Widget
          size={{ width: 6, height: 1 }}
          position={{ gridX: 9, gridY: 4 }}
        >
          <Weather></Weather>
        </Widget>
      </Grid>

      <Menu active={menuOpen}></Menu>
    </div>
  );
};

export default App;
