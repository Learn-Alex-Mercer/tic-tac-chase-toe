/**
 * Create a Weapon class.
 */
class Weapon {
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
  }

  /**
   * Place the weapon on the given row and column, if it's not owned by a player.
   * @param {number} row - The new row of the board where the weapon should be located.
   * @param {number} column - The new column of the board where the weapon should be located.
   * @returns {boolean} True if the weapon was moved to the new location.
   */
  moveTo(row, column) {
    if (this.owner !== undefined) { return false; }

    this.location.row = row;
    this.location.column = column;

    console.log(`${this.name} moved to ${row}x${column}.`)

    return true;
  }
}

/**
 * A module that hosts the Weapon class.
 * @module Weapon
 */
export default Weapon;