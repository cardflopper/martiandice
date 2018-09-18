import React from "react";

const diceGroup = props => {
  let output = [];
  for (let i = 0; i < props.n; i++) {
    output.push(
      <img
        key={props.face + "_" + i}
        alt={props.face}
        onClick={() => props.click(props.face, props.n)}
        src={"./images/" + props.face + ".png"}
      />
    );
  }

  return output;
};

export default diceGroup;
