/**
 * Tic Tac Chase Toe Game
 * @author Usman Bashir <me@usmanbashir.com>
 * @copyright 2019
 * @version 1.0.0
 */

// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run the code faster.
'use strict';

import Game from './game.js';

/**
 * Get everything setup and the game responding to user actions.
 * This method requires the class {@link Game}.
 * @function
 */
const init = function() {
  const newGame = new Game();
}

// Call the initialization function when the DOM is done loading to 
// get everything setup and the game responding to user actions.
document.addEventListener("DOMContentLoaded", () => init());