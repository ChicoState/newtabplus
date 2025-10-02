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
        backgroundColor: "lightcoral",
        borderRadius: "12px",
        border: "4px solid pink",
        opacity: 0.75,
      }}
    ></div>
  );
};

const App = () => {
  return (
    <div className="content">
      <Grid width={24} height={12}>
        <Widget size={{ width: 4, height: 4 }}>
          <TestBox></TestBox>
        </Widget>
        <Widget size={{ width: 8, height: 1 }}>
          <TestBox></TestBox>
        </Widget>
      </Grid>
    </div>
  );
};

export default App;
