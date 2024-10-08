const { createCanvas } = require('canvas');
const fs = require('fs');

// Constants for the board size and cell count
const BOARD_SIZE = 15; // 15x15 grid
const CELL_SIZE = 40; // Size of each cell in pixels

// Initialize canvas
const canvas = createCanvas(BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);
const ctx = canvas.getContext('2d');

// Define cell colors and paths
const green = [1, 2, 3, 4, 5, 6, 16, 21, 31, 36, 46, 51, 61, 66, 76, 76, 77, 78, 79, 80, 81];
const red = green.map(i => i + 9);
const yellow = green.map(i => i + 135);
const blue = green.map(i => i + 144);
const black = [97, 99, 127, 129, 113];

// Specific paths for each color
let greenPath = [92, 107, 108, 109, 110, 111, 112];
let redPath = [23, 38, 53, 68, 83, 98, 24];
let yellowPath = [202, 203, 188, 173, 158, 143, 128];
let bluePath = [134, 119, 118, 117, 116, 115, 114];

// Color definitions
const colorDefinitions = {
    green: green,
    red: red,
    yellow: yellow,
    blue: blue,
    black: black,
};

// Path traversal order
let pathOrder = [217, 202, 187, 172, 157, 142, 126, 125, 124, 123, 122, 121, 106, 91, 92, 93, 94, 95, 96, 82, 67, 52, 37, 22, 7, 8, 9, 24, 39, 54, 69, 84, 100, 101, 102, 103, 104, 105, 120, 135, 134, 133, 132, 131, 130, 144, 159, 174, 189, 204, 219, 219];

// Number of pieces in house
let piecesInHouse = {
    green: 4,
    red: 4,
    yellow: 4,
    blue: 4
};

// Array to hold all piece instances
let pieces = [];

// Function to get cell color
function getColor(i) {
    if (green.includes(i) || greenPath.includes(i)) return "green";
    if (red.includes(i) || redPath.includes(i)) return "red";
    if (yellow.includes(i) || yellowPath.includes(i)) return "yellow";
    if (blue.includes(i) || bluePath.includes(i)) return "blue";
    if (black.includes(i)) return "black";
    return "white"; // default white
}

// Function to draw cells on the canvas
function drawCells() {
    for (let i = 1; i <= BOARD_SIZE * BOARD_SIZE; i++) {
        const color = getColor(i);
        const x = ((i - 1) % BOARD_SIZE) * CELL_SIZE;
        const y = Math.floor((i - 1) / BOARD_SIZE) * CELL_SIZE;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
}

// Piece class
class Piece {
    constructor(housePosition, pieceColor, home) {
        this.housePosition = housePosition;
        this.position = housePosition;
        this.color = pieceColor;
        this.inHouse = true; // Initially in the house
        this.home = home;

        pieces.push(this);
    }

    placePiece(i) {
        this.position = i;
        drawPiece(i);
    }

    movePiece(j) {
        const i = this.position;

        const otherPiece = pieces.find(p => p.position === j && p.color !== this.color);
        if (otherPiece) {
            otherPiece.placePiece(otherPiece.home);
            console.log(`${otherPiece.color} piece sent back home!`);
        }

        this.position = j;
        drawPiece(i);
        this.placePiece(j);
    }

    removeFromHome() {
        if (this.inHouse) {
            this.movePiece(this.home);
            this.inHouse = false;
            piecesInHouse[this.color]--;
        } else {
            console.log("Piece not in house");
        }
    }

    move(byNum) {
        let nextCell;
        for (let i = 0; i < pathOrder.length; i++) {
            if (pathOrder[i] === this.position) {
                nextCell = pathOrder[i + byNum];
                break;
            }
        }
        if (nextCell) this.movePiece(nextCell);
        return true; // Successful move
    }
}

// Player colors
const playerColors = ["green", "red", "blue", "yellow"];
let currentPlayerIndex = 0; // Track whose turn it is

// Initialize pieces
const initializePieces = () => {
    const pieceConfigurations = [
        { color: 'green', positions: [33, 34, 48, 49], home: 92 },
        { color: 'red', positions: [42, 43, 57, 58], home: 24 },
        { color: 'yellow', positions: [168, 169, 183, 184], home: 202 },
        { color: 'blue', positions: [177, 178, 192, 193], home: 134 },
    ];

    pieceConfigurations.forEach(config => {
        config.positions.forEach(pos => new Piece(pos, config.color, config.home));
    });
};

// Function to draw a piece on the canvas
function drawPiece(position) {
    const piece = pieces.find(p => p.position === position);
    if (piece) {
        const pieceColor = piece.color;
        const x = ((position - 1) % BOARD_SIZE) * CELL_SIZE + CELL_SIZE / 2;
        const y = Math.floor((position - 1) / BOARD_SIZE) * CELL_SIZE + CELL_SIZE / 2;

        ctx.fillStyle = pieceColor;
        ctx.beginPath();
        ctx.arc(x, y, CELL_SIZE / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Function to render the initial game board
function renderBoard() {
    drawCells();
    pieces.forEach(piece => {
        drawPiece(piece.position);
    });
}

// Function to roll the dice and manage turn
function rollDice() {
    const rolledNumber = Math.floor(Math.random() * 6) + 1; // Returns a number between 1 and 6
    console.log(`You rolled a ${rolledNumber}.`);

    // Determine if the roll allows for a move
    if (rolledNumber === 6) {
        console.log(`${playerColors[currentPlayerIndex]}'s turn! You rolled a 6!`);
    } else {
        console.log(`${playerColors[currentPlayerIndex]}'s turn! You rolled a ${rolledNumber}.`);
    }

    return rolledNumber; // Return the rolled number
}

// Save board state to file
function saveBoardState() {
    const outputPath = './game-board.png';
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Game board updated. Check ${outputPath} for the latest state.`);
}

// Main function to create and manage the game board
function ludo() {
    // Initialize pieces and render the board
    initializePieces();
    renderBoard();

    // Expose methods for rolling dice and moving pieces
    return {
        rollDice: () => {
            const rolledNumber = rollDice();

            // Check if the player rolled a 6 to allow moving a piece
            if (rolledNumber === 6) {
                console.log("You can move a piece out of the house!");
            }

            // Save the board state after rolling the dice
            saveBoardState();

            return rolledNumber; // Return the rolled number
        },
        movePiece: (pieceIndex, steps) => {
            const piece = pieces.filter(p => p.color === playerColors[currentPlayerIndex])[pieceIndex];

            if (piece) {
                piece.move(steps); // Move the piece according to the rolled number
                renderBoard();
                saveBoardState(); // Save the board state after moving the piece
            } else {
                console.log("Invalid piece selection.");
            }
        },
        nextTurn: () => {
            currentPlayerIndex = (currentPlayerIndex + 1) % playerColors.length; // Switch to the next player
            console.log(`It's now ${playerColors[currentPlayerIndex]}'s turn.`);
        },
        pieces, // Expose the pieces for external access
        currentPlayerColor: () => playerColors[currentPlayerIndex] // Function to get the current player color
    };
}

// Export the createGameBoard function for external use
module.exports = ludo;

