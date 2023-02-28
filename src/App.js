import React from "react";
import { Foundation, Stock, Tableau, Waste } from "./container";
import { Deck } from "./components";
import "./App.css";

const App = () => {
  return (
    <div className="window">
      {/* <Stock />
      <Waste />
      <Foundation />
       */}
      <Deck />
    </div>
  );
};

export default App;
