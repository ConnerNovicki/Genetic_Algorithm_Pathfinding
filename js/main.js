var boardCreator;

//Finished Board, just a 2D array of [bool, bool, bool, bool] to represent walls
var board;
var population;

var rows = 10;
var cols = 10;
var cellsize = 30;

var state = 1;
var count = 0;

var POP_SIZE = 30;


function setup() {
  createCanvas(cols * cellsize, rows * cellsize);
  boardCreator = new BoardCreator(cols, rows, cellsize);
}

function draw() {
  background(0);
  switch (state) {
    case 1:
      createBoard();
      break;
    // case 2:
    //   findShortestPath();
    //   break;
    case 2:
      geneticAlgorithm();
      break;
  }
}

function createBoard() {
  count++;
  boardCreator.run();
  boardCreator.drawCells();
  if (boardCreator.done) {
    state = 2;
    board = boardCreator.getFinishedBoard();
    population = new Population(POP_SIZE, cellsize);
    population.randomize();
    population.setBoard(board);
  }
}

// function findShortestPath() {
//
// }

function geneticAlgorithm() {
  population.update();
  boardCreator.drawCells();
  population.draw();
}
