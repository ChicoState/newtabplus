import React, { useState } from "react";
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
  const [boxes, setBoxes] = useState([]);
    const handleClick = ({ pageX, pageY }) => {
    setBoxes((boxes) => [...boxes, { x: pageX, y: pageY }]);
  };
  const ButtonBox = () => {
  return (
    <div onClick={handleClick}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "cyan",
        borderRadius: "12px",
        border: "4px solid cyan",
        opacity: 0.75,
        textAlign: "center",
        alignContent: "center",
        color: "black"
      }}
    >Add Widget</div>
  );
}
  return (
    <div className="content">
      <Grid width={24} height={12}>
        <Widget size={{ width: 4, height: 4 }}>
          <TestBox></TestBox>
        </Widget>
        <Widget size={{ width: 3, height: 2 }}>
          <TestBox></TestBox>
        </Widget>
        <Widget size={{ width: 3, height: 3 }}>
          <ButtonBox></ButtonBox>
        </Widget>
        {boxes.map((box) => {
         return <Widget key={box.x} size={{ width: 3, height: 3 }}><TestBox></TestBox></Widget>
        })}
      </Grid>
    </div>
  );
};

export default App;
