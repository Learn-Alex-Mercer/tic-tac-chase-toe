const CLICK_EVENT = "click";

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
   * @param {Array} weapons - The list of weapons on the map.
   * @param {Array} players - The list of players on the map.
   * @param {function} updateDashboardFn - Function to update player dashboard UI.
   */
  constructor(rows = 100, columns = 100, percentage = 90, containerElement, weapons, players, updateDashboardFn) {
    this.rows = rows;
    this.columns = columns;
    this.percentage = percentage;
    this.container = containerElement;
    this.weapons = weapons;
    this.players = players;
    this.updatePlayerDashboard = updateDashboardFn;

    this._fight = false;

    this.matrix = this._verifiedMapMatrix();

    this._generateMap();

    this.container.addEventListener(CLICK_EVENT, this.onEmptyBoxClicked);
  }

  get grid() {
    return this.matrix;
  }

  /**
   * Verify the generated map matrix to make sure it contains required
   * percentage of blocked boxes. Otherwise, build a new map matrix
   * until it meets the requirements.
   * @private
   * @returns {Array} Map Matrix
   */
  _verifiedMapMatrix() {
    const mapMatrix = this._buildMapMatrix();
    const boxesValid = mapMatrix.flat().filter(state => state === false).length >= (100 - this.percentage);

    if (boxesValid) {
      return mapMatrix;
    } else {
      return this._verifiedMapMatrix();
    }
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
        const randChance = Math.floor(Math.random() * (this.rows * this.columns));

        // Set the column as available if the random number is `percentage` or less.
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

    this.matrix.forEach((row, rowIndex) => {
      // Create a new div with the "row" class for each row in the matrix.
      let elmRow = document.createElement("div");
      elmRow.className = "row";

      row.forEach((column, columnIndex) => {
        // Based on the column being available or blocked for use by the players.
        // Create a new div with appropriate CSS class's to visually distinguish them.
        let elmColumn = document.createElement("div");
        elmColumn.className = column === true ? "box empty" : "box blocked";
        elmColumn.setAttribute('data-row', rowIndex);
        elmColumn.setAttribute('data-column', columnIndex);
        elmRow.appendChild(elmColumn);
      });

      // Add the completed row to the Map element in the DOM.
      this.container.appendChild(elmRow);
    });
  }

  /**
   * Move the player to the selected valid box. Where they will pick up any weapon inside
   * the box. And, change the game turn for the next player.
   * @param {Event} e
   * @function
  */
  onEmptyBoxClicked = (e) => {
    if (this._fight === false) {
      const elmBox = e.target;

      if (elmBox.classList.contains("valid")) {
        const newRow = parseInt(elmBox.getAttribute("data-row"));
        const newColumn = parseInt(elmBox.getAttribute("data-column"));

        // Find current player.
        let currentPlayer = this.players.find((player) => {
          return player.className === this.container.querySelector(".current-player").getAttribute("data-player-id");
        });

        // Only pickup a weapon from a box if another player is not occupying it.
        if (elmBox.querySelector(".weapon") !== null && elmBox.querySelector(".player") === null) {
          currentPlayer.pickUpWeapon(this.weapons, newRow, newColumn);
        }

        currentPlayer.moveTo(newRow, newColumn);

        // Change turn, if the fight has not begin when the current player moved.
        if (this._fight === false) {
          // Update the current players dashboard information.
          this.updatePlayerDashboard(currentPlayer);

          currentPlayer = currentPlayer === this.players[0] ? this.players[1] : this.players[0];
          currentPlayer.takeTurn(this.matrix);
          this.updatePlayerDashboard(currentPlayer, true);
        }
      }
    }
  }

  /**
   * Disable the map if both players have weapons.
   *
   * @param {Player} initiatingPlayer
   */
  beginFight(initiatingPlayer) {
    if (this.players[0].weapon !== null && this.players[1].weapon !== null) {
      this._fight = true;
      this.container.classList.add("disabled");
    }

    // TODO: Add Attack & Defend Buttons to Player Dashboards
  }
}