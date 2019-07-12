import { getBoxElement, getRandomBox, isBoxAvailable, isBoxInUse } from './helper.js';

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
   * @param {number} specs.location.row - The current row of the board where the weapon is located.
   * @param {number} specs.location.column - The current column of the board where the weapon is located.
   */
  constructor(specs) {
    this.name = specs.name;
    this.className = specs.className;
    this.src = specs.src;
    this.damage = specs.damage;
    this.owner = specs.owner ? specs.owner : null;
    this.location = specs.location ? specs.location : { row: null, column: null };

    this.element = document.createElement("img");
    this.element.className = `weapon ${this.className}`;
    this.element.src = this.src;
  }

  /**
   * Place the weapon randomly on the new map.
   * @param {Array} map - The Map Matrix.
   * @param {Array} weapons - The list of other weapons potentially on the map.
   */
  placeSelfOnMap(map, weapons) {
    const rows = map.length;
    const columns = map[0].length;
    const randBox = getRandomBox(rows, columns);
    const box = isBoxAvailable(map, rows, columns, randBox);

    // In case the box is available and does not already contains another weapon.
    // We can go ahead and add this weapon to the box.
    if (box.available && isBoxInUse(box, weapons) === false) {
      this.moveTo(box.row, box.column);
    } else {
      // If we don't find an available box or if it already contains another weapon.
      // Go ahead and call this function again with the same parameters until we can
      // find an available box that does not contains a weapon.
      this.placeSelfOnMap(map, weapons);
    }
  }

  /**
   * Get the current location of the weapon.
   * Regardless of it being owned by a {@link Player} or not.
   * @readonly
   * @returns {object} Location Object
   */
  getLocation() {
    if (this.owner === null) {
      return this.location;
    } else {
      return this.owner.location;
    }
  }

  /**
   * Hide the DOM element for the weapon.
   */
  hide() {
    this.element.classList.add("hidden");
  }

  /**
   * Show the DOM element for the weapon.
   */
  show() {
    this.element.classList.remove("hidden");
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
   * Move the weapon to the same location as its owner.
   */
  moveToOwner() {
    if (this.owner !== null) {
      this._move(this.owner.location);
    }
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