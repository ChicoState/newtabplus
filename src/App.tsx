import React, { useState } from "react";
import { Grid } from "./Grid";
import Widget from "./Widget";
import { Clock } from "./widgets/Clock";
import styles from "./App.css";
import BatteryWidget from "./BatteryWidget";

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

        <Widget size={{ width: 2, height: 1 }} position={{ gridX: 20, gridY: 0 }}>
          <BatteryWidget />
        </Widget>

      </Grid>
    </div>
  );
};

export default App;
