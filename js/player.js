import { getBoxElement } from './helper.js';

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