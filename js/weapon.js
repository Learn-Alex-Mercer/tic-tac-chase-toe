import { getBoxElement } from './helper.js';

/**
 * Create a Weapon class.
 */
export default class Weapon {
  /**
   * Create a weapon.
   * @param {object} specs - The specs of the weapon.
   * @param {string} specs.name - The name of the weapon.
   * @param {string} specs.className - The CSS class name of the weapon.
   * @param {string} specs.src - The image source for the weapon.
   * @param {number} specs.damage - The amount of damage caused by the weapon.
   * @param {?Player} specs.owner - The owner of the weapon.
   * @param {?object} specs.location - The current location of the weapon on the board. If it's not owned.
   * @param {?number} specs.location.row - The current row of the board where the weapon is located.
   * @param {?number} specs.location.column - The current column of the board where the weapon is located.
   */
  constructor(specs) {
    this.name = specs.name;
    this.className = specs.className;
    this.src = specs.src;
    this.damage = specs.damage;
    this.owner = specs.owner;
    this.location = specs.location;

    this.element = document.createElement("img");
    this.element.className = `weapon ${this.className}`;
    this.element.src = this.src;
  }

  /**
   * Get the current location of the weapon.
   * Regardless of it being owned by a {@link Player} or not.
   * @readonly
   * @returns {object} Location Object
   */
  getLocation() {
    if (this.owner === undefined || this.owner === null) {
      return this.location;
    } else {
      return this.owner.location;
    }
  }

  /**
   * Place the weapon on the given row and column, if it's not owned by a {@link Player}.
   * @param {number} row - The new row of the board where the weapon should be located.
   * @param {number} column - The new column of the board where the weapon should be located.
   * @returns {boolean} True if the weapon was moved to the new location.
   */
  moveTo(row, column) {
    if (this.owner !== null) { return false; }

    this._move({row, column});

    return true;
  }

  /**
   * Move the weapon to the given location.
   * @param {object} location - The new location of the weapon on the board.
   * @param {number} location.row - The new row of the board where the weapon should be moved to.
   * @param {number} location.column - The new column of the board where the weapon should be moved to.
   * @private
   */
  _move(location) {
    this.location.row = location.row;
    this.location.column = location.column;

    getBoxElement(this.location.row, this.location.column).appendChild(this.element);
  }
}