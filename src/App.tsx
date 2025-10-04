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
      }}
    ></div>
  );
};

const App = () => {
  return (
    <div className="content">
      <Grid width={24} height={12} showGrid={true}>
        <Widget position={{ gridX: 9, gridY: 4 }}>
          <TestBox></TestBox>
        </Widget>

        <Widget
          size={{ width: 10, height: 1 }}
          position={{ gridX: 7, gridY: 2 }}
        >
          <TestBox></TestBox>
        </Widget>

        <Widget
          size={{ width: 1, height: 1 }}
          position={{ gridX: 7, gridY: 4 }}
          resizeable={false}
        >
          <TestBox></TestBox>
        </Widget>
      </Grid>
    </div>
  );
};

export default App;
