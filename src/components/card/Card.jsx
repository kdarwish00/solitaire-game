import React, { useState } from "react";
import "./card.css";

const Card = ({ suit, value, rank, index, flipped, selected, onClick }) => {
  return (
    <div className="solitaire">
      <div
        className={`solitaire__card ${
          suit === "♥" || suit === "♦" ? "solitaire__card-red" : ""
        } ${flipped ? "solitaire__card-flipped" : ""}
        ${selected ? "solitaire__card-selected" : ""}`}
        onClick={onClick}
        rank={rank}
        index={index}
      >
        {flipped ? " " : `${value}${suit}`}
      </div>
    </div>
  );
};


export default Card;
