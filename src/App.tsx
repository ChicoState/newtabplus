import React from "react";
import { Grid } from "./Grid";
import Widget from "./Widget";
import "./App.css";

const TestBox = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "slategray",
        borderRadius: "12px",
        border: "4px solid darkgray",
        // opacity: 0.75,
      }}
    ></div>
  );
};

const App = () => {
  return (
    <div className="content">
      <Grid width={24} height={12} showGrid={true}>
        <Widget position={{ gridX: 0, gridY: 2 }}>
          <TestBox></TestBox>
        </Widget>

        <Widget size={{ width: 8, height: 1 }}>
          <TestBox></TestBox>
        </Widget>

        <Widget
          size={{ width: 1, height: 1 }}
          position={{ gridX: 7, gridY: 2 }}
          resizeable={false}
        >
          <TestBox></TestBox>
        </Widget>
      </Grid>
    </div>
  );
};

export default App;
