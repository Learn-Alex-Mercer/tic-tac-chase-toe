/**
 * Create a Map class.
 */
export default class Map {
  /**
   * Create a map, add it the DOM and return the map matrix.
   * @param {number} rows - The number of rows for the map.
   * @param {number} columns - The number of columns for the map.
   * @param {number} percentage - The percentage for the available boxes.
   * @param {Element} containerElement - The DOM container element for the rendered map.
   * @returns {Array} Map Matrix
   */
  constructor(rows = 100, columns = 100, percentage = 90, containerElement) {
    this.rows = rows;
    this.columns = columns;
    this.percentage = percentage;
    this.container = containerElement;

    this.matrix = this._buildMapMatrix();

    this._generateMap();

    return this.matrix;
  }

  /**
   * Build a map matrix based on the specified number of rows and columns
   * along with the percentage of chance that a given box would be available
   * and not blocked.
   * @private
   * @returns {Array} Map Matrix
   */
  _buildMapMatrix() {
    let newMapMatrix = [];
    
    for (let row = 0; row < this.rows; row++) {
      let matrixRow = [];

      for (let column = 0; column < this.columns; column++) {
        // Get a random number between 1 and (ROWS * COLUMNS).
        const randChance = Math.floor( Math.random() * (this.rows * this.columns) );

        // Set the column as available if the random number is 80 or less.
        // Otherwise, the column will be unavailable for players to use.
        matrixRow.push(randChance <= this.percentage ? true : false);
      }

      // Add the completed row to the new map matrix.
      newMapMatrix.push(matrixRow);
    }

    return newMapMatrix;
  }

  /**
   * Build a map based on the map matrix and add it to the DOM.
   * @private
   */
  _generateMap() {
    // Clear the map of all content, if any. So we can start fresh.
    let firstChild = this.container.firstChild;
    while(firstChild) {
      this.container.removeChild(firstChild);
      firstChild = this.container.firstChild;
    }

    this.matrix.forEach(row => {
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
      this.container.appendChild(elmRow);
    });
  }
}