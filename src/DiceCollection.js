import React from "react";
import DiceGroup from "./DiceGroup";

const diceCollection = props => {
  const classes =
    props.action == "select dice" ? "collection active" : "collection";

  return (
    <div className={classes}>
      {props.dice.map((n, face) => (
        <DiceGroup key={face} click={props.click} face={face} n={n} />
      ))}
    </div>
  );
};

export default diceCollection;
