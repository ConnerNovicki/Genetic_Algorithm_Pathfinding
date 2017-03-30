var boardCreator;

//Finished Board, just a 2D array of [bool, bool, bool, bool] to represent walls
var board;
var population;
var shortestPath = [];

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
   case 2:
      findShortestPath();
      boardCreator.markAllCellsUnvisited();
      break;
    case 3:
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
  }
}

function getDirectionsFromPath(path) {
  var moves = [];
  for (var i = 0; i < path.length - 1; i++) {
    var [x1, y1] = path[i];
    var [x2, y2] = path[i + 1];
    var move;
    if (x1 == x2) {
      // Moved up or down
      if (y2 - y1 > 0) {
        // Moved down
        move = 2;
      } else {
        move = 0;
      }
    } else {
      if (x2 - x1 > 0) {
        // moved right
        move = 1;
      } else {
        move = 3;
      }
    }
    moves.push(move);
  }
  return moves;
}

function findShortestPath() {
  shortestPath = boardCreator.findShortestPath(0, 0);
  var shortestDirections = getDirectionsFromPath(shortestPath);
  population = new Population(POP_SIZE, cellsize, shortestDirections);
  population.randomize();
  population.setBoard(board);
  state = 3;
}

function geneticAlgorithm() {
  population.update();
  boardCreator.drawCells();
  boardCreator.drawPath(shortestPath);
  population.draw();
}
