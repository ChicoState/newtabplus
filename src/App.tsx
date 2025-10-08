import React, { useState } from "react";
import { Grid } from "./Grid";
import Widget from "./Widget";
import styles from "./App.css";
import { Note } from "./widgets/Note";

const TestBox = () => {
  return <div className={styles.testBox}></div>;
};

const App = () => {
  const [editing, setEditing] = useState(false);

  return (
    <div className={styles.content}>
      {/*Temporary button for testing edit mode*/}
      <button
        className={[styles.testBox, styles.testButton].join(" ")}
        onClick={() => {
          setEditing(!editing);
        }}
      >
        {editing ? "Disable" : "Enable"} Edit Mode
      </button>

      <Grid width={24} height={12} editing={editing}>
        <Widget
          size={{ width: 10, height: 1 }}
          position={{ gridX: 7, gridY: 2 }}
        >
          <TestBox></TestBox>
        </Widget>

        <Widget position={{ gridX: 8, gridY: 4 }}>
          <TestBox></TestBox>
        </Widget>

        <Widget
          size={{ width: 1, height: 4 }}
          position={{ gridX: 15, gridY: 4 }}
          resizeable={false}
        >
          <TestBox></TestBox>
        </Widget>
      </Grid>
    </div>
  );
};

export default App;
