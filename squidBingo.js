const fs = require("fs");

// Read the input.txt file
const fileContent = fs.readFileSync("input.txt", { encoding: "utf-8" });

// Split the file content into sections based on empty lines
const sections = fileContent.split(/\n\s*\n/);

// Extract draw numbers
const drawSection = sections.find((section) =>
  section.includes("Draw number:")
);
const drawNumbers = drawSection
  .split(":")[1]
  .trim()
  .split(",")
  .map((num) => parseInt(num.trim()));

// Extract board sections
const boardSections = sections.filter((section) => section.includes("\n"));

class Board {
  constructor(boardNumbers) {
    this.boardSize = 5;
    this.boardNumbers = boardNumbers;
    this.row = Array(this.boardSize).fill(0);
    this.column = Array(this.boardSize).fill(0);
    this.isRowOrColumnMarked = false;
    this.markedNumbers = new Set();
  }

  crossMarkedNumber(number) {
    const index = this.boardNumbers.indexOf(number);
    if (index === -1) {
      return;
    }

    this.markedNumbers.add(number);
    const row = Math.floor(index / this.boardSize);
    const col = index % this.boardSize;
    this.row[row]++;
    this.column[col]++;

    // Check if a row or column is completely marked
    if (
      this.row[row] === this.boardSize ||
      this.column[col] === this.boardSize
    ) {
      this.isRowOrColumnMarked = true;
    }
  }

  unmarkedNumber() {
    return this.boardNumbers.filter(
      (n) => !this.markedNumbers.has(n) && !isNaN(n)
    );
  }

  isBingo() {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.row[i] === this.boardSize || this.column[i] === this.boardSize) {
        return true;
      }
    }
    return false;
  }

  calculateScore(lastDrawnNumber) {
    const unmarked = this.unmarkedNumber();
    if (unmarked.length > 0 && !isNaN(lastDrawnNumber)) {
      const sum = unmarked.reduce((sum, num) => sum + num, 0);
      return sum * lastDrawnNumber;
    } else {
      return 0;
    }
  }

  displayBoard() {
    const sequence = [];
    for (let i = 0; i < this.boardSize; i++) {
      const row = this.boardNumbers
        .slice(i * this.boardSize, i * this.boardSize + this.boardSize)
        .map((n) => (this.markedNumbers.has(n) ? `*${n}*` : n));
      sequence.push(row.join("\t"));
    }
    console.log(sequence.join("\n") + "\n");
  }
}

// Create an array of Board objects
const boards = boardSections.map((section) => {
  const boardNumbers = section
    .split("\n")
    .join(" ")
    .split(/\s+/)
    .map((num) => parseInt(num.trim()));
  return new Board(boardNumbers);
});

function checkBingoInEveryBoard(drawNumbers, boards) {
  let lastWinningBoard;
  let lastWinningNumber;
  let allBoardsMarked = false;

  for (const number of drawNumbers) {
    if (allBoardsMarked) {
      break;
    }
    for (const board of boards) {
      if (!board.isRowOrColumnMarked) {
        board.crossMarkedNumber(number);
        if (board.isBingo()) {
          lastWinningBoard = board;
          lastWinningNumber = number;
          board.isRowOrColumnMarked = true;
        }
      }
    }
    allBoardsMarked = boards.every((board) => board.isRowOrColumnMarked);
  }

  if (lastWinningBoard) {
    console.log(`Last Bingo on board:`);
    lastWinningBoard.displayBoard();
    console.log(`Last number drawn: ${lastWinningNumber}`);
    const score = lastWinningBoard.calculateScore(lastWinningNumber);
    console.log(`Score: ${score}`);
  }
}

checkBingoInEveryBoard(drawNumbers, boards);
