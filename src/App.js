import React, { Component } from "react";
import DiceCollection from "./DiceCollection";
import Counter from "./Counter";
import Header from "./Header";

class App extends Component {
  state = {
    round: 1,
    roll: this.roll(),
    saved: [0, 0, 0, 0, 0],
    action: "select dice",
    message: "welcome",
    points: 0,
    status: "in progress",
    showInstructions: false
  };

  TANK = 0;
  CHICKEN = 3;
  COW = 2;
  HUMAN = 1;
  DEATHRAY = 4;

  render() {
    let buttonClasses = "active";

    let instructions = this.state.showInstructions ? (
      <p className="instructions">
        <ul>
          <li>
            In Martian Dice you are aliens trying to abduct specimens (chickens,
            cows, humans) for your research while avoiding the human tanks.
          </li>
          <li>
            <img alt="dice list" src="./images/faces_list.png" />
          </li>
          <li>
            You roll the number of dice available (13 to start) then you select
            a type of dice and add all of them to your saved area. Then you
            reroll all the remaining dice and start again.
          </li>
          <li>
            (If you roll any tanks (red) you must select them before making your
            main dice selection.)
          </li>
          <li>
            Rayguns (green) allow you to defeat tanks, at the end of game, must
            have rayguns greater or equal to tanks otherwise you lose and score
            zero
          </li>
          <li>
            Any specimens (chickens, cows, humans) you have at the end of the
            game are worth 1 point each.
          </li>
          <li>
            You must choose carefully though because once you select a specimen,
            you can no longer select the same specimen again. If you are unable
            to select any dice, the game ends and it might be a win or lose.
          </li>
        </ul>
      </p>
    ) : null;

    return (
      <React.Fragment>
        <Header className="header" />
        <div className={buttonClasses}>
          <button onClick={this.restartHandler}>Restart Game</button>
          &nbsp;&nbsp;
          <button onClick={this.toggleInstructions}>Instructions</button>
        </div>
        {instructions}
        <h3>{this.state.message}</h3>
        <h4>
          <Counter count={this.diceCount(this.state.roll)} /> dice available
        </h4>

        <DiceCollection
          action={this.state.action}
          click={this.clickHandler}
          dice={this.state.roll}
          name="roll"
        />
        <h4>
          tanks: <Counter count={this.state.saved[this.TANK]} /> deathrays:{" "}
          <Counter count={this.state.saved[this.DEATHRAY]} />
        </h4>

        <DiceCollection
          action={null}
          click={() => {}}
          dice={this.state.saved}
          name="saved"
        />
      </React.Fragment>
    );
  }

  toggleInstructions = () => {
    let showInstructions = this.state.showInstructions;
    this.setState({ showInstructions: !showInstructions });
  };

  diceCount(dice) {
    let count = 0;
    for (let i = 0; i < 5; i++) count += dice[i];
    return count;
  }
  restart() {
    let round = 1,
      roll = this.roll(),
      saved = [0, 0, 0, 0, 0],
      message = "welcome to the game",
      action = "select dice",
      points = 0,
      status = "in progress";
    this.setState({
      round: round,
      roll: roll,
      saved: saved,
      message: message,
      action: action,
      points: points,
      status: status,
      showInstructions: false
    });
  }
  restartHandler = () => {
    if (window.confirm("are you sure you want to restart?")) {
      this.restart();
    }
  };

  clickHandler = (face, n) => {
    let round = this.state.round;
    let roll = this.state.roll.slice();
    let saved = this.state.saved.slice();
    let message = this.state.message;
    let action = this.state.action;
    let points = this.state.points;
    let status = this.state.status;

    const names = ["tank", "human", "cow", "chicken", "deathray"],
      faceName = names[face];

    switch (this.state.action) {
      case "select dice":
        if (roll[this.TANK] > 0 && face != this.TANK) {
          message = "you must handle tanks first!";
        } else if (
          saved[face] > 0 &&
          face != this.DEATHRAY &&
          face != this.TANK
        ) {
          message = "you've already selected " + faceName + "s";
        } else {
          roll = this.state.roll.slice();
          saved = this.state.saved.slice();

          saved[face] += n;
          roll[face] -= n;
          //get active dice faces
          let diceCount = this.diceCount(roll);

          let plural = n == 1 ? "" : "s";
          if (face != this.TANK) {
            message = "you selected " + n + " " + faceName + plural;
            round++;
            roll = this.roll(diceCount);
          } else
            message =
              n + " tank" + plural + " arrived! now you can make your pick";

          points = 0;

          if (saved[this.DEATHRAY] >= saved[this.TANK]) {
            points += saved[1];
            points += saved[2];
            points += saved[3];
          }
        }
        break;
      case "restart":
        if (window.confirm("are you sure you want to restart?")) this.restart();
        return;
      case "default":
        alert("error default case reached");
        break;
    }
    //check game over
    let s = points == 1 ? "" : "s";

    if (this.diceCount(saved) === 13) {
      //ran out of dice

      action = "restart";
      if (saved[this.DEATHRAY] >= saved[this.TANK]) {
        //more rays than tanks!
        status = "win";

        message =
          points > 0
            ? "you won with " + points + " point" + s + "!"
            : "you survived, but you didn't score any points!";
      } else {
        status = "lose";
        message =
          "you didn't have enough deathrays! you got " +
          points +
          " point" +
          s +
          "!";
      }
    } else {
      //here we make two arrays savedFaces and rollFaces
      //these array store true/false for each type of face (1,2,3)=>(chicken, cow, human)
      //for example if i have rolled chickens and cows rollFaces = [false,true,true]
      //for example if i only have saved cows savedFaces = [false,true,false]
      let fails = 0;

      let savedFaces = saved.map(i => i > 0).slice(1, 4);
      let rollFaces = roll.map(i => i > 0).slice(1, 4);
      console.log(rollFaces, savedFaces);

      //here we check each face type in the two arrays if they are both true it counts as a fail
      //because we are unable to take that type anymore and it might be a no-win situation
      for (let i = 0; i < 3; i++)
        if (rollFaces[i] === true && savedFaces[i] === true) fails++;

      //here we check the number of trues in rollFaces and compare to # fails
      // if it's equal, then we are unable to take anything
      // ...and if there are no tanks or rayguns
      if (
        fails === rollFaces.filter(i => i === true).length &&
        roll[this.TANK] === 0 &&
        roll[this.DEATHRAY] === 0
      ) {
        if (saved[this.DEATHRAY] >= saved[this.TANK]) {
          //more rays than tanks!
          action = "restart";
          status = "win";
          message =
            "you can't take any more dice, but you you won with " +
            points +
            " point" +
            s +
            "!";
        } else {
          action = "restart";
          status = "lose";
          message =
            "you can't take any more dice but lost because you have enough deathrays!";
        }
      }
    }

    this.setState({
      round: round,
      roll: roll,
      saved: saved,
      message: message,
      points: points,
      action: action,
      status: status
    });
  };

  roll(dice = 13) {
    let tmp = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < dice; i++) {
      let face = Math.floor(Math.random() * 6);
      tmp[face] += 1;
    }
    let rays = tmp[5];
    let result = tmp.slice(0, 5);
    result[4] += rays;
    return result;
  }
}

export default App;
