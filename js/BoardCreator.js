var Cell = function(x, y, cellsize) {
  this.x = x;
  this.y = y;
  this.cellsize = cellsize;
  this.visited = false;
  this.walls = [true, true, true, true];
}

Cell.prototype.removeWall = function(wall) {
  this.walls[wall] = false;
};

Cell.prototype.draw = function(color) {
  var c = this.cellsize;
  var x = this.x * c;
  var y = this.y * c;

  fill(color);
  noStroke();
  rect(x, y, c, c);

  stroke("black");
  strokeWeight(2);
  if (this.walls[0]) line(x, y, x + c, y);
  if (this.walls[1]) line(x + c, y, x + c, y + c);
  if (this.walls[2]) line(x, y + c, x + c, y + c);
  if (this.walls[3]) line(x, y, x, y + c);
}

/////////////////////////////////////////////////////////////
//                    Board Creator                        //
/////////////////////////////////////////////////////////////

var BoardCreator = function(cols, rows, cellsize) {
  this.cols = cols;
  this.rows = rows;
  this.cellsize = cellsize;
  this.done = false;
  this.cells = [];
  this.stack = [];

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.cells.push(new Cell(j, i, this.cellsize));
    }
  }

  this.currentCell = this.cells[0];
}

BoardCreator.prototype.getCellAt = function(x, y) {
  return this.cells[y * this.cols + x];
}

BoardCreator.prototype.getNeighborCell = function(x, y, side) {
  if (side === 0) y--;
  else if (side === 1) x++;
  else if (side === 2) y++;
  else x--;
  return this.getCellAt(x, y);
}

BoardCreator.prototype.markCellVisited = function(x, y) {
  this.getCellAt(x, y).visited = true;
}

BoardCreator.prototype.cellBeenVisited = function(x, y) {
  return this.getCellAt(x, y).visited;
}

BoardCreator.prototype.drawCells = function() {
  this.cells.forEach(function(c) {
    if (c.visited) c.draw("blue");
    else c.draw("grey");
  });
  this.currentCell.draw("red");
}

BoardCreator.prototype.validCell = function(x, y) {
  return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
}

BoardCreator.prototype.getUnvisitedSides = function(x, y) {
  var sides = [],
      cellIndices = [];
  cellIndices.push([x, y - 1])
  cellIndices.push([x + 1, y])
  cellIndices.push([x, y + 1])
  cellIndices.push([x - 1, y])

  for (var i = 0; i < cellIndices.length; i++) {
    var [x0, y0] = cellIndices[i];
    if (this.validCell(x0, y0)) {
      if (!this.cellBeenVisited(x0, y0)) {

        sides.push(i);
      }
    }
  }
  return sides;
}

BoardCreator.prototype.getFinishedBoard = function() {
  // board is 2d array
  var board = [];
  for (var i = 0; i < this.rows; i++) {
    var row = [];
    for (var j = 0; j < this.cols; j++) {
      row.push(this.getCellAt(j, i).walls);
    }
    board.push(row);
  }
  return board;
}

BoardCreator.prototype.run = function() {
  // Get neighbors
  var unvisitedSides = this.getUnvisitedSides(this.currentCell.x, this.currentCell.y);
  //console.log(unvisitedSides);
  // If there are neighbors
  if (unvisitedSides.length > 0) {
    // Choose random neighbor
    var randomSide = unvisitedSides[Math.floor(Math.random() * unvisitedSides.length)];
    // Remove 2 walls: currCell and neighbor
    this.currentCell.removeWall(randomSide);
    var neighborCell = this.getNeighborCell(this.currentCell.x, this.currentCell.y, randomSide);
    neighborCell.removeWall((randomSide + 2) % 4);
    // Push current cell to stack
    this.stack.push(this.currentCell);
    // Make neighbor current Cell
    this.markCellVisited(this.currentCell.x, this.currentCell.y);
    this.currentCell = neighborCell;
  }

  // Else If stack not empty (no neighbors)
  else if (this.stack.length > 0) {
    // Pop cell from stack and make it current cell
    this.markCellVisited(this.currentCell.x, this.currentCell.y);
    this.currentCell = this.stack.pop();
  }

  // Else (no neighbors and empty stack)
  else {
    // We are done
    this.done = true;
  }
}
