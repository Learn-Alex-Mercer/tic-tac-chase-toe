/**
 * Get a random box number between 1 and (rows * columns).
 * @param {number} rows
 * @param {number} columns
 * @returns {number}
 */
const getRandomBox = function(rows, columns) {
  return Math.floor(Math.random() * (rows * columns));
}

/**
 * Get the DOM element for the given row and column.
 * @param {number} row
 * @param {number} column
 * @returns {Element}
 */
const getBoxElement = function(row, column) {
  return document.querySelectorAll(".row")[row].querySelectorAll(".box")[column];
}

export { getRandomBox, getBoxElement };