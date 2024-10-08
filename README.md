<p align="center">
  <a href="https://github.com/Cyberkingcr7/ludo">
    <img title="Ludo.js" src="https://img.shields.io/badge/Ludo.js-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge">
  </a>
  <br>
  Ludo.js Documentation
  <hr>
</p>

<h3 align="center">Ludo.js</h3>
<p align="center">
  Ludo.js is a Node.js module for creating and managing a basic Ludo game with visual representation. It simulates a Ludo board with player pieces and includes functionality for dice rolls, piece movement, and turn management.
</p>

## Table of Contents
- [Installation](#installation)
- [Initialization](#initialization)
- [Board Setup](#board-setup)
- [Piece Class](#piece-class)
- [Game Methods](#game-methods)
  - [rollDice()](#rolldice)
  - [movePiece(pieceIndex, steps)](#movepiecepieceindex-steps)
  - [nextTurn()](#nextturn)
- [Customizing the Board](#customizing-the-board)
- [Example Usage](#example-usage)


## Installation
Install the required dependencies:

```bash
npm install canvas 
```
<p>The module uses the canvas library to render the game board and pieces visually.</p>

## Initialization

Create an instance of the Ludo game by requiring and invoking the module:

javascript
Copy code
const ludo = require('./path-to-your/ludo.js')();
## Board Setup
The Ludo board is represented as a 15x15 grid, with each cell having a size of 40 pixels. The game initializes with 4 pieces for each color (green, red, yellow, and blue) placed in their respective houses.

The drawCells() function creates and colors the cells, while drawPiece() handles the rendering of pieces at specific positions.

## Piece Class
The Piece class represents a player piece on the Ludo board. It includes the following properties and methods:

Properties:
housePosition: Initial position of the piece in the house.
position: Current position of the piece on the board.
color: Color of the piece (e.g., 'green', 'red', etc.).
inHouse: Boolean indicating if the piece is still in the house.
home: Position of the piece's home cell on the board.
Methods:
placePiece(position): Places the piece at a specific position on the board.

## movePiece(destination): Moves the piece to the destination cell.
removeFromHome(): Moves the piece out of the house when a player rolls a 6.
move(steps): Moves the piece along its path based on the number of steps.

## Game Methods
The following methods are exposed by the Ludo module for gameplay control:

## rollDice()
Rolls a dice and returns a value between 1 and 6. If the roll is a 6, the player can move a piece out of their house.

Returns:

number: The rolled dice value.
javascript
Copy code
const rollValue = ludo.rollDice();

## movePiece(pieceIndex, steps)

Moves a piece belonging to the current player by the specified number of steps. The piece is selected based on its index in the player's set of pieces.

Parameters:

pieceIndex (number): Index of the piece to be moved.
steps (number): Number of steps to move the piece.
Returns:

void
javascript
Copy code
ludo.movePiece(0, 6); // Move the first piece 6 steps forward.
## nextTurn()
Advances the game to the next player's turn.

Returns:

void
javascript
Copy code
ludo.nextTurn();

## Customizing the Board

Piece Colors and Paths: The paths and initial positions for the pieces are defined in arrays like greenPath, redPath, etc.
Home Positions: Each piece has a home position that can be customized in the initializePieces() function.

## Example Usage
Here's a sample usage scenario demonstrating how to initialize the game, roll the dice, move pieces, and manage turns:

javascript
Copy code
const ludo = require('./ludo.js')();

<p> // Roll the dice for the current player
const roll = ludo.rollDice();

// If the roll is 6, move a piece out of the house
if (roll === 6) {
    ludo.movePiece(0, roll); // Move the first piece of the current player
}

// Switch to the next player
ludo.nextTurn(); </p>
