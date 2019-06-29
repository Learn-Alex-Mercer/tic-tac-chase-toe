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

import Weapon from './weapon.js';
import Player from './player.js';

/**
 * A constant list of players.
 * @readonly
 */
const PLAYERS = [
  new Player({
    name: "Player 1",
    className: "playerOne",
    src: "images/people/soldier/stand.png",
    health: 100,
    weapon: null,
    location: { row: null, column: null }
  }),
  new Player({
    name: "Player 2",
    className: "playerTwo",
    src: "images/people/hitman/stand.png",
    health: 100,
    weapon: null,
    location: { row: null, column: null }
  })
];

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
 * Get everything setup and the game responding to user actions.
 * This file requires the modules {@link Weapon} and {@link Player}.
 * @function
 * @requires Weapon
 * @requires Player
 */
function init() {
  console.log("Tic Tac Chase Toe Init...")

  const mapElm = document.querySelector(".map");

  const map = buildMapMatrix(10, 10);

  generateMap(map, mapElm);
  placeWeapons(map, mapElm, WEAPONS);
  placePlayers(map, mapElm, PLAYERS, WEAPONS);
}

// Call the initialization function when the DOM is done loading to 
// get everything setup and the game responding to user actions.
document.addEventListener("DOMContentLoaded", () => init());

// Build a map matrix based on the specified number of rows and columns
// with an 90% chance that a given box would be available and not blocked.
function buildMapMatrix(rows, columns) {
  const AVAILABLE_BOXES_PERCENTAGE = 90;
  let newMapMatrix = [];
  
  for (let row = 0; row < rows; row++) {
    let matrixRow = [];

    for (let column = 0; column < columns; column++) {
      // Get a random number between 1 and (ROWS * COLUMNS).
      const randChance = Math.floor( Math.random() * (rows * columns) );

      // Set the column as available if the random number is 80 or less.
      // Otherwise, the column will be unavailable for players to use.
      matrixRow.push(randChance <= AVAILABLE_BOXES_PERCENTAGE ? true : false);
    }

    // Add the completed row to the new map matrix.
    newMapMatrix.push(matrixRow);
  }

  return newMapMatrix;
}

// Build a map based on the provided map matrix and add it to the DOM.
function generateMap(map, mapElm) {
  // Clear the map of all content, if any. So we can start fresh.
  let firstChild = mapElm.firstChild;
  while(firstChild) {
    mapElm.removeChild(firstChild);
    firstChild = mapElm.firstChild;
  }

  map.forEach(row => {
    // Create a new div with the "row" class for each row in the matrix.
    let elmRow = document.createElement("div");
    elmRow.className = "row";

    row.forEach(column => {
      // Based on the column being available or blocked for use by the players.
      // Create a new div with appropriate CSS class's to visually distinguish them.
      let elmColumn = document.createElement("div");
      elmColumn.className = column === true ? "box" : "box blocked";
      elmRow.appendChild(elmColumn);
    });

    // Add the completed row to the Map element in the DOM.
    mapElm.appendChild(elmRow);
  });
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
    weapon.location.row = box.row;
    weapon.location.column = box.column;

    // Add the weapon to the given box in the map.
    const weaponElm = document.createElement("img");
    weaponElm.className = `weapon ${weapon.className}`;
    weaponElm.src = weapon.src;
    getBoxElement(weapon.location.row, weapon.location.column).appendChild(weaponElm);
  } else {
    // If we don't find an available box or if it already contains another weapon.
    // Go ahead and call this function again with the same parameters until we can
    // find an available box that does not contains a weapon.
    placeWeapon(weapon, map, rows, columns, weapons);
  }
}

// Find out if the box in question is marked as available or unavailable.
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
    player.location.row = box.row;
    player.location.column = box.column;

    const playerElm = document.createElement("img");
    playerElm.className = `player ${player.className}`;
    playerElm.src = player.src;
    getBoxElement(player.location.row, player.location.column).appendChild(playerElm);
  } else {
    placePlayer(player, map, rows, columns, players, weapons);
  }
}

// Get a random box between 1 and (rows * columns).
function getRandomBox(rows, columns) {
  return Math.floor( Math.random() * (rows * columns) );
}

function getBoxElement(row, column) {
  return document.querySelectorAll(".row")[row].querySelectorAll(".box")[column];
}