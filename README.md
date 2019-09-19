# Tic Tac Chase Toe

A turn-based board game in JavaScript

- [Play Online](https://tic-tac-chase-toe.surge.sh/)
- [Read Documentation](https://tic-tac-chase-toe.surge.sh/docs/)

----

An online game written in vanilla JavaScript, in which 2 players play each turn to compete. 

The game starts by randomly generating the game map. Where each box can be either empty or blocked. With a limited number of weapons (up to 4) placed randomly and can be collected by players who pass through. While starting each player with a basic default weapon.

For each turn, a player can move from one to three boxes (horizontally or vertically) before ending their turn. They obviously can not pass through obstacles directly.

If a player passes over a box containing a weapon, they leave their current weapon on-site and replace it with the new one.

If players cross over adjacent squares (horizontally or vertically), a battle begins.

During combat, the game works as follows:

- Each player attacks in turn
- The damage depends on the player's weapon
- The player can choose to attack or defend against the next shot
- If the player chooses to defend themselves, they sustain 50% less damage than normal
- As soon as the HP/life points of a player (initially 100) fall to 0, they lose. A message appears and the game is over.

This game was an experiment to see what could be achieved using modern vanilla JavaScript using Object-Oriented Programming. It was also an exercise to see how good comments can also help produce good documentation.

Although there was a lot more I wanted to do with this project in terms of features and design. But I had to stop somewhere and version 1 was more than good enough for that.
