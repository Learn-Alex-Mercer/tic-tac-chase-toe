import Map from './map.js';
import Weapon from './weapon.js';
import Player from './player.js';
import * as EVENTS from './events.js';

export default class Game {
  constructor() {
    console.log("Tic Tac Chase Toe Init...");

    this.weapons = [
      new Weapon ({
        name: "Knife T1",
        className: "knifeT1",
        damage: 5,
        src: "images/weapons/knife_t1.png"
      }),
      new Weapon ({
        name: "Knife T2",
        className: "knifeT2",
        damage: 5,
        src: "images/weapons/knife_t2.png"
      }),
      new Weapon ({
        name: "Pistol",
        className: "pistol",
        damage: 10,
        src: "images/weapons/pistol.png",
      }),
      new Weapon ({
        name: "Shotgun",
        damage: 20,
        className: "shotgun",
        src: "images/weapons/shotgun.png",
      }),
      new Weapon ({
        name: "Machine Gun",
        damage: 30,
        className: "machinegun",
        src: "images/weapons/machinegun.png",
      }),
      new Weapon ({
        name: "Sniper",
        damage: 40,
        className: "sniper",
        src: "images/weapons/sniper.png",
      }),
    ];

    this.players = [
      new Player({
        name: "Player 1",
        className: "playerOne",
        src: "images/people/soldier/stand.png",
        health: 100,
      }),
      new Player({
        name: "Player 2",
        className: "playerTwo",
        src: "images/people/hitman/stand.png",
        health: 100,
      }),
    ];


    const elmMap = document.querySelector(".map");
    this.map = new Map(10, 10, 90, elmMap, this.weapons, this.players, this.updateDashboard);

    // Take the pre-defined weapons and randomly distribute them across the game board.
    this.weapons.forEach(weapon => weapon.placeSelfOnMap(this.map.grid, this.weapons));

    // Take the pre-defined players and randomly distribute them across the game board.
    this.players.forEach(player => player.placeSelfOnMap(this.map, this.players, this.weapons));


    // Wire up events for attack and defend buttons.
    document.querySelectorAll('.dashboard .attack')
      .forEach( elm => elm.addEventListener(EVENTS.CLICK, this.onAttackClick) );
    document.querySelectorAll('.dashboard .defend')
      .forEach( elm => elm.addEventListener(EVENTS.CLICK, this.onDefendClick) );


    // Assign a starting weapon to each player.
    const knifeOne = this.weapons[0];
    const knifeTwo = this.weapons[1];

    this.players[0].pickUpWeapon(this.weapons, knifeOne.getLocation().row, knifeOne.getLocation().column);
    this.players[1].pickUpWeapon(this.weapons, knifeTwo.getLocation().row, knifeTwo.getLocation().column);

    knifeOne.moveToOwner();
    knifeTwo.moveToOwner();


    // Start the game by giving the first turn to player one.
    const currentPlayer = this.players[0];
    currentPlayer.takeTurn(this.map.grid);
    this.updateDashboard(currentPlayer, true);

    // Update the dashboard for the 2nd player so they can also
    // see their default weapon.
    this.updateDashboard(this.players[1]);
  }

  /**
   * Get the current player object.
   * @param {Event} e 
   * @private
   */
  _getCurrentPlayer(e) {
    const parentClassNames = e.target.parentNode.className.split(' ');
    const currentPlayerName = parentClassNames.filter( klass => klass.includes('player') )[0].toLowerCase();

    return currentPlayerName.includes('one') ? this.players[0] : this.players[1];
  }

  onAttackClick = e => {
    const currentPlayer = this._getCurrentPlayer(e);
    console.log(currentPlayer);
  }

  onDefendClick = e => {
    const currentPlayer = this._getCurrentPlayer(e);
    console.log(currentPlayer);
  }

  /**
   * If either players health has reached 0, the game is over.
   * @returns {boolean}
   */
  isCurrentGameOver() {
    return this.players[0].health === 0 || this.players[1].health === 0;
  }

  /**
   * Return the player who won the current game.
   * @returns {Player} Winning Player
   */
  getCurrentGameWinner() {
    if (this.players[0].health > 0) {
      return this.players[0];
    }

    if (this.players[1].health > 0) {
      return this.players[1];
    }
  }

  resetGame = e => {
    window.location.reload();
  }

  /**
   * Update the given player dashboard when player picks up a new weapon or when a 
   * fight has started. Allowing the player to attack or defend them selves.
   * @param {Player} player 
   * @param {boolean} current 
   * @param {boolean} fight 
   */
  updateDashboard(player, current = false, fight = false) {
    const dashboard = document.querySelector(`.dashboard.${player.className}`);

    if (current) {
      document.querySelector('.dashboard.current') && document.querySelector('.dashboard.current').classList.remove('current');
      dashboard.classList.add("current");
    }

    dashboard.querySelector('.name').innerText = player.name;
    dashboard.querySelector('.health').innerText = `HP: ${player.health}`;
    dashboard.querySelector('.photo').src = player.src;

    if (player.weapon) {
      dashboard.querySelector('.weapon-name').innerText = `Weapon: ${player.weapon.name}`;
      dashboard.querySelector('.weapon-damage').innerText = `Damage: ${player.weapon.damage}`;
    } else {
      dashboard.querySelector('.weapon-name').innerText = `Weapon: N/A`;
      dashboard.querySelector('.weapon-damage').innerText = `Damage: 0`;
    }

    if (fight) {
      dashboard.querySelectorAll('button').forEach( elm => elm.removeAttribute('disabled') );
    } else {
      dashboard.querySelectorAll('button').forEach( elm => elm.setAttribute('disabled', 'disabled') );
    }
  }
}
