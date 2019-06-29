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
   * @param {?number} specs.location.row - The current row of the board where the player is located.
   * @param {?number} specs.location.column - The current column of the board where the player is located.
   */
  constructor(specs) {
    this.name = specs.name;
    this.className = specs.className;
    this.src = specs.src;
    this.health = specs.health;
    this.weapon = specs.weapon;
    this.location = specs.location;
  }

  /**
   * Place the player on the given row and column.
   * @param {number} row - The new row of the board where the player should be located.
   * @param {number} column - The new column of the board where the player should be located.
   */
  moveTo(row, column) {
    this.location.row = row;
    this.location.column = column;

    console.log(`${this.name} moved to ${row}x${column}.`)
  }
}