import React, { useState } from "react";
import "./card.css";

const Card = ({
  suit,
  value,
  rank,
  index,
  flipped,
  selected,
  onClick,
  onDoubleClick,
  tableau,
  key,
}) => {
  return (
    <div className="solitaire">
      <div
        className={`solitaire__card ${
          suit === "♥" || suit === "♦" ? "solitaire__card-red" : ""
        } ${flipped ? "solitaire__card-flipped" : ""}
        ${selected ? "solitaire__card-selected" : ""}
        ${tableau ? "solitaire__card-tableau" : ""}`}
        onClick={onClick}
        rank={rank}
        index={index}
        onDoubleClick={onDoubleClick}
      >
        {flipped ? (
          <img
            src="https://i.pinimg.com/originals/8b/87/4a/8b874ac3b63e483339cbdb05a15fb716.jpg"
            alt="Back of card"
          />
        ) : (
          <>
            <h1>{value}</h1>
            <h2>{suit}</h2>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
