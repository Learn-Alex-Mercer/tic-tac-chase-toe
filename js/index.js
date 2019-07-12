/**
 * Tic Tac Chase Toe Game
 * @author Usman Bashir <me@usmanbashir.com>
 * @copyright 2019
 * @version 0.3.0
 */

// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run the code faster.
'use strict';

import Map from './map.js';
import Weapon from './weapon.js';
import Player from './player.js';

const CLICK_EVENT = "click";

/**
 * A list of players.
 * @readonly
 */
const PLAYERS = [];

/**
 * A constant list of weapons.
 * @readonly
 */
const WEAPONS = [
  new Weapon ({
    name: "Pistol",
    className: "pistol",
    damage: 10,
    src: "images/weapons/pistol.png",
  }),
  new Weapon ({
    name: "Shotgun",
    damage: 20,
    className: "shotgun",
    src: "images/weapons/shotgun.png",
  }),
  new Weapon ({
    name: "Machine Gun",
    damage: 30,
    className: "machinegun",
    src: "images/weapons/machinegun.png",
  }),
  new Weapon ({
    name: "Sniper",
    damage: 40,
    className: "sniper",
    src: "images/weapons/sniper.png",
  }),
];

/**
 * Reference to the current player with the turn.
 */
let currentPlayer;

let map;

/**
 * Get everything setup and the game responding to user actions.
 * This method requires the classes {@link Weapon} and {@link Player}.
 * @function
 */
function init() {
  console.log("Tic Tac Chase Toe Init...")

  const mapElm = document.querySelector(".map");

  map = new Map(10, 10, 90, mapElm);

  // Take the pre-defined weapons and randomly distribute them across the game board.
  WEAPONS.forEach(weapon => {
    weapon.placeSelfOnMap(map, WEAPONS);
  });


  PLAYERS.push(new Player({
    name: "Player 1",
    className: "playerOne",
    src: "images/people/soldier/stand.png",
    health: 100,
  }));

  PLAYERS.push(new Player({
    name: "Player 2",
    className: "playerTwo",
    src: "images/people/hitman/stand.png",
    health: 100,
  }));

  PLAYERS.forEach(player => {
    player.placeSelfOnMap(map, PLAYERS, WEAPONS);
  });

  currentPlayer = PLAYERS[0];

  currentPlayer.showValidMoves(map);

  document.querySelector("div.map").addEventListener(CLICK_EVENT, onEmptyBoxClicked);
}

// Call the initialization function when the DOM is done loading to 
// get everything setup and the game responding to user actions.
document.addEventListener("DOMContentLoaded", () => init());

const onEmptyBoxClicked = function(e) {
  const elmBox = e.target;

  if (elmBox.classList.contains("valid")) {
    const newRow = parseInt(elmBox.getAttribute("data-row"));
    const newColumn = parseInt(elmBox.getAttribute("data-column"));

    if (elmBox.querySelector(".weapon") !== null) {
      currentPlayer.pickUpWeapon(WEAPONS, newRow, newColumn);
    }

    currentPlayer.moveTo(newRow, newColumn);


    // Change turn
    currentPlayer = currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    currentPlayer.showValidMoves(map);
  }
}