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

/**
 * Find out if the box in question is marked as available or unavailable.
 * @param {Array} map - The Map Matrix.
 * @param {number} rows - The number of rows in the map.
 * @param {number} columns - The number of columns in the map.
 * @param {number} box - The box number in question.
 * @returns {object}
 */
const isBoxAvailable = function(map, rows, columns, box) {
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
const isBoxInUse = function(box, items) {
  return items.some(item => {
    if (item.location.row === box.row && item.location.column === box.column) {
      return true;
    } else {
      return false;
    }
  });
}

export { getRandomBox, getBoxElement, isBoxAvailable, isBoxInUse };