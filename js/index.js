/**
 * Tic Tac Chase Toe Game
 * @author Usman Bashir <me@usmanbashir.com>
 * @copyright 2019
 * @version 0.3.0
 */

// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run our code faster.
'use strict';

import Map from './map.js';
import Weapon from './weapon.js';
import Player from './player.js';
import { getRandomBox, getBoxElement } from './helper.js';

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
    owner: null,
    location: { row: null, column: null },
  }),
  new Weapon ({
    name: "Shotgun",
    damage: 20,
    className: "shotgun",
    src: "images/weapons/shotgun.png",
    owner: null,
    location: { row: null, column: null },
  }),
  new Weapon ({
    name: "Machine Gun",
    damage: 30,
    className: "machinegun",
    src: "images/weapons/machinegun.png",
    owner: null,
    location: { row: null, column: null },
  }),
  new Weapon ({
    name: "Sniper",
    damage: 40,
    className: "sniper",
    src: "images/weapons/sniper.png",
    owner: null,
    location: { row: null, column: null },
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
  
  placeWeapons(map, mapElm, WEAPONS);


  PLAYERS.push(new Player({
    name: "Player 1",
    className: "playerOne",
    src: "images/people/soldier/stand.png",
    health: 100,
    weapon: null,
    location: { row: null, column: null }
  }, mapElm));

  PLAYERS.push(new Player({
    name: "Player 2",
    className: "playerTwo",
    src: "images/people/hitman/stand.png",
    health: 100,
    weapon: null,
    location: { row: null, column: null }
  }, mapElm));

  placePlayers(map, mapElm, PLAYERS, WEAPONS);

  currentPlayer = PLAYERS[0];

  placeValidPlayerMoves(map, currentPlayer);

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

    currentPlayer.moveTo(newRow, newColumn);

    // Change turn
    currentPlayer = currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    placeValidPlayerMoves(map, currentPlayer);
  }
}

/**
 * 
 * @param {Array} map - The Map Matrix.
 * @param {Player} player - The player with the turn.
 */
const placeValidPlayerMoves = function(map, player) {
  // Clean up the previous valid player movers.
  document.querySelectorAll(".valid").forEach(elmBox => elmBox.classList.remove("valid"));

  const {row, column} = player.location;
  const rows = map.length - 1;
  const columns = map[0].length - 1;

  if (row > 0) {
    const breakLimit = row < 3 ? row : 3;

    for (let index = 1; ; index++) {
      if (index > breakLimit) { break; }

      const elmBox = getBoxElement(row - index, column);

      if (elmBox.classList.contains("blocked")) { break; }

      elmBox.classList.add('valid');
    }
  }

  if (row < rows) {
    const breakLimit = row > (rows - 3) ? (rows - row) : 3;

    for (let index = 1; ; index++) {
      if (index > breakLimit) { break; }

      const elmBox = getBoxElement(row + index, column);

      if (elmBox.classList.contains("blocked")) { break; }

      elmBox.classList.add('valid');
    }
  }

  if (column > 0) {
    const breakLimit = column < 3 ? column : 3;

    for (let index = 1; ; index++) {
      if (index > breakLimit) { break; }

      const elmBox = getBoxElement(row, column - index);

      if (elmBox.classList.contains("blocked")) { break; }

      elmBox.classList.add('valid');
    }
  }

  if (column < columns) {
    const breakLimit = column > (columns - 3) ? (columns - column) : 3;

    for (let index = 1; ; index++) {
      if (index > breakLimit) { break; }

      const elmBox = getBoxElement(row, column + index);

      if (elmBox.classList.contains("blocked")) { break; }

      elmBox.classList.add('valid');
    }
  }
}


// Take the pre-defined weapons and randomly distribute them across the game board.
function placeWeapons(map, mapElm, weapons) {
  const rows = map.length;
  const columns = map[0].length;

  weapons.forEach(weapon => {
    placeWeapon(weapon, map, rows, columns, weapons);
  });
}

function placeWeapon(weapon, map, rows, columns, weapons) {
  const randBox = getRandomBox(rows, columns);
  const box = isBoxAvailable(map, rows, columns, randBox);

  // In case the box is available and does not already contains another weapon.
  // We can go ahead and add the given weapon to this box.
  if (box.available && isBoxInUse(box, weapons) === false) {
    weapon.moveTo(box.row, box.column);
  } else {
    // If we don't find an available box or if it already contains another weapon.
    // Go ahead and call this function again with the same parameters until we can
    // find an available box that does not contains a weapon.
    placeWeapon(weapon, map, rows, columns, weapons);
  }
}

/**
 * Find out if the box in question is marked as available or unavailable.
 * @param {Array} map - The Map Matrix.
 * @param {number} rows - The number of rows in the map.
 * @param {number} columns - The number of columns in the map.
 * @param {number} box - The box number in question.
 * @returns {object}
 */
function isBoxAvailable(map, rows, columns, box) {
  // Convert the box number into something we can use to find the row and
  // column in the map to which the box belongs to.
  // 
  // Example: (67 * 10) / 100 = 6.7
  const result = (box * columns) / (rows * columns);

  // The digits before the decimal separator represent the row.
  const row = Math.floor(result);

  // The digits after the decimal separator represent the column.
  const column = parseInt((result + "").split(".")[1]);

  if (map[row][column]) {
    return { available: true, row: row, column: column };
  }
  
  return { available: false };
}

// Check if any of the weapons/players have already been placed on the map.
// So we don't add another one of them in the same box on the map.
function isBoxInUse(box, items) {
  return items.some(item => {
    if (item.location.row === box.row && item.location.column === box.column) {
      return true;
    } else {
      return false;
    }
  });
}

function placePlayers(map, mapElm, players, weapons) {
  const rows = map.length;
  const columns = map[0].length;

  players.forEach(player => {
    placePlayer(player, map, rows, columns, players, weapons);
  });
}

function placePlayer(player, map, rows, columns, players, weapons) {
  const randBox = getRandomBox(rows, columns);

  const box = isBoxAvailable(map, rows, columns, randBox);

  if (box.available && isBoxInUse(box, weapons) === false && isBoxInUse(box, players) === false) {
    player.moveTo(box.row, box.column);
  } else {
    placePlayer(player, map, rows, columns, players, weapons);
  }
}