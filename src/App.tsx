import React, { useState } from "react";
import Widget from "./Widget";
import Menu from "./Menu";
import { Grid } from "./Grid";
import { Weather } from "./widgets/Weather";
import { Clock } from "./widgets/Clock";
import { ToDoList } from "./widgets/ToDoList";
import { Notepad } from "./widgets/Notepad";
import { Search } from "./widgets/Search";
import { Shortcut } from "./widgets/Shortcut";
import styles from "./App.css";
import BatteryWidget from "./widgets/BatteryWidget";
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
          size={{ width: 5, height: 5 }}
          position={{ gridX: 18, gridY: 1 }}
        >
          <ToDoList></ToDoList>
        </Widget>

        <Widget
          size={{ width: 5, height: 5 }}
          position={{ gridX: 1, gridY: 1 }}
        >
          <Notepad></Notepad>
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

        <Widget
          size={{ width: 1, height: 1 }}
          position={{ gridX: 10, gridY: 5 }}
          resizeable={false}
        >
          <Shortcut url="https://canvas.csuchico.edu"></Shortcut>
        </Widget>

        <Widget
          size={{ width: 1, height: 1 }}
          position={{ gridX: 11, gridY: 5 }}
          resizeable={false}
        >
          <Shortcut url="https://outlook.com"></Shortcut>
        </Widget>

        <Widget
          size={{ width: 1, height: 1 }}
          position={{ gridX: 12, gridY: 5 }}
          resizeable={false}
        >
          <Shortcut url="https://github.com"></Shortcut>
        </Widget>

        <Widget
          size={{ width: 1, height: 1 }}
          position={{ gridX: 13, gridY: 5 }}
          resizeable={false}
        >
          <Shortcut url="https://stackoverflow.com"></Shortcut>
        </Widget>

        <Widget
          size={{ width: 2, height: 1 }}
          position={{ gridX: 20, gridY: 0 }}
        >
          <BatteryWidget />
        </Widget>
      </Grid>

      <Menu active={menuOpen}></Menu>
    </div>
  );
};

export default App;