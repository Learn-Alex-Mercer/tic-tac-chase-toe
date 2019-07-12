import { getBoxElement, getRandomBox, isBoxAvailable, isBoxInUse } from './helper.js';

/**
 * Create a Player class.
 */
export default class Player {
  /**
   * Create a player.
   * @param {object} specs - The specs of the player.
   * @param {string} specs.name - The name of the player.
   * @param {string} specs.className - The CSS class name of the player.
   * @param {string} specs.src - The image source for the player.
   * @param {number} specs.health - The current health level of the player.
   * @param {?Weapon} specs.weapon - The current weapon owned by the player.
   * @param {?object} specs.location - The current location of the player on the board.
   * @param {number} specs.location.row - The current row of the board where the player is located.
   * @param {number} specs.location.column - The current column of the board where the player is located.
   */
  constructor(specs) {
    this.name = specs.name;
    this.className = specs.className;
    this.src = specs.src;
    this.health = specs.health;
    this.weapon = specs.weapon ? specs.weapon : null;
    this.location = specs.location ? specs.location : { row: null, column: null };

    this.element = document.createElement("img");
    this.element.className = `player ${this.className}`;
    this.element.src = this.src;

    this.oldWeapon = null;
  }

  /**
   * Place the player randomly on the new map.
   * @param {Array} map - The Map Matrix.
   */
  placeSelfOnMap(map, players, weapons) {
    const rows = map.length;
    const columns = map[0].length;
    const randBox = getRandomBox(rows, columns);
    const box = isBoxAvailable(map, rows, columns, randBox);

    if (box.available && isBoxInUse(box, weapons) === false && isBoxInUse(box, players) === false) {
      this.moveTo(box.row, box.column);
    } else {
      this.placeSelfOnMap(map, players, weapons);
    }
  }

  /**
   * Place the player on the given row and column.
   * @param {number} row - The new row of the board where the player should be located.
   * @param {number} column - The new column of the board where the player should be located.
   */
  moveTo(row, column) {
    this.location.row = row;
    this.location.column = column;

    const elmNewBox = getBoxElement(row, column);
    elmNewBox.appendChild(this.element);

    if (this.weapon) {
      this.weapon.moveToOwner();
    }

    // In case the player has an old weapon and is moving to a new box which doesn’t
    // have the old weapon. Make sure the old weapon’s drop off is completed.
    if (this.oldWeapon !== null && elmNewBox.querySelectorAll(".weapon.hidden").length === 0) {
      this._dropOldWeapon();
    }
  }

  /**
   * Find and show valid moves on the map for the player.
   * @param {Array} map - The Map Matrix.
   */
  showValidMoves(map) {
    // Clean up the previous valid player movers.
    document.querySelectorAll(".valid").forEach(elmBox => elmBox.classList.remove("valid"));

    const {row, column} = this.location;
    const rows = map.length - 1;
    const columns = map[0].length - 1;

    // When the player is near the top side of the map.
    if (row > 0) {
      const breakLimit = row < 3 ? row : 3;
      this._findValidMoves("up", breakLimit, row, column);
    }

    // When the player is near the bottom side of the map.
    if (row < rows) {
      const breakLimit = row > (rows - 3) ? (rows - row) : 3;
      this._findValidMoves("down", breakLimit, row, column);
    }

    // When the player is near the left side of the map.
    if (column > 0) {
      const breakLimit = column < 3 ? column : 3;
      this._findValidMoves("left", breakLimit, row, column);
    }

    // When the player is near the right side of the map.
    if (column < columns) {
      const breakLimit = column > (columns - 3) ? (columns - column) : 3;
      this._findValidMoves("right", breakLimit, row, column);
    }
  }

  /**
   * Find up to 3 valid moves in a given direction.
   * @param {string} direction - The direction to search in.
   * @param {number} limit - The max limit of moves to be found.
   * @param {number} initialRow - Starting row to search around.
   * @param {number} initialColumn - Starting column to search around.
   */
  _findValidMoves(direction, limit, initialRow, initialColumn) {
    for (let index = 1; index <= limit; index++) {
      let newRow = initialRow;
      let newColumn = initialColumn;

      if (direction === "up") { newRow = initialRow - index; }
      if (direction === "down") { newRow = initialRow + index; }
      if (direction === "left") { newColumn = initialColumn - index; }
      if (direction === "right") { newColumn = initialColumn + index; }

      const elmBox = getBoxElement(newRow, newColumn);

      // If we hit a blocked box, there aren't any vaild moves left in this direction.
      if (elmBox.classList.contains("blocked")) { break; }

      elmBox.classList.add('valid');
    }
  }

  /**
   * Pick up a new weapon and prepare to drop the old one at the same place, swapping them.
   * @param {Array} weapons - The list of weapons to find the new weapon from.
   * @param {number} row - The row of the weapon to pickup from.
   * @param {number} column - The column of the weapon to pickup from.
   */
  pickUpWeapon(weapons, row, column) {
    // In case of swapping 3 weapons consecutively. Make sure, the first weapon's
    // drop off is completed.
    if (this.oldWeapon !== null && getBoxElement(row, column).querySelectorAll(`.${this.oldWeapon.className}`).length === 0 ) {
      this._dropOldWeapon();
    }

    // Set the old weapon to the current weapon.
    this.oldWeapon = this.weapon;

    // Find the new weapon from the list which matches the players location.
    const newWeapon = weapons.find(weapon => {
      if (weapon.location.row === row && weapon.location.column === column) {
        return weapon;
      }
    });

    this.weapon = newWeapon;
    this.weapon.owner = this;

    // Prepare to drop the old weapon.
    if (this.oldWeapon !== null) {
      this._prepareToDropOldWeapon(row, column);
    }
  }

  /**
   * Prepare to drop the players old weapon at the given location.
   * @param {number} dropOffRow - The drop off row.
   * @param {number} dropOffColumn - The drop off column.
   * @private
   */
  _prepareToDropOldWeapon(dropOffRow, dropOffColumn) {
    this.oldWeapon.owner = null;
    this.oldWeapon.moveTo(dropOffRow, dropOffColumn);
    this.oldWeapon.hide();
  }

  /**
   * Drop the players old weapon.
   * @private
   */
  _dropOldWeapon() {
    this.oldWeapon.show();
    this.oldWeapon = null;
  }
}