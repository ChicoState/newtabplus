import React, { useState } from "react";
import Widget from "./Widget";
import Menu from "./Menu";
import { Grid } from "./Grid";
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
      <div className={[styles.container, styles.header].join(" ")}>
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
          size={{ width: 10, height: 1 }}
          position={{ gridX: 7, gridY: 3 }}
        >
          <TestBox></TestBox>
        </Widget>

        <Widget position={{ gridX: 8, gridY: 5 }}>
          <TestBox></TestBox>
        </Widget>

        <Widget
          size={{ width: 1, height: 4 }}
          position={{ gridX: 15, gridY: 5 }}
          resizeable={false}
        >
          <TestBox></TestBox>
        </Widget>
      </Grid>

      <Menu active={menuOpen}></Menu>
    </div>
  );
};

export default App;
