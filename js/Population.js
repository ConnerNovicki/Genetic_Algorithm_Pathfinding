function Vehicle(cellsize) {
  this.x = 0;
  this.y = 0;
  this.cellsize = cellsize;
  this.moves = [];
  this.MAX_LENGTH = 100;
  this.ind = 0;
  this.alive = true;
  this.fitness = 0;
  this.maxDistance = 0;
  this.lastMove = -1;
  this.mutationRate = 0.01;
}

Vehicle.prototype.calculateFitness = function() {
  this.fitness = this.maxDistance;
}

Vehicle.prototype.randomize = function() {
  for (var i = 0; i < this.MAX_LENGTH; i++) {
    this.moves.push(Math.floor(Math.random() * 4));
  }
}

Vehicle.prototype.setMoves = function(moves) {
  this.moves = moves;
}

Vehicle.prototype.canMove = function(board) {
  var m = this.moves[this.ind];
  var [x, y] = [this.x, this.y];
  if (m == 0) y--;
  else if (m == 1) x++;
  else if (m == 2) y++;
  else x--;

  // Check in bounds
  if (x < 0 || x >= board[0].length || y < 0 || y >= board.length) return false;

  // Check if hitting wall
  if (board[this.y][this.x][m]) return false;

  // If move is opposite of last move
  if ((m + 2) % 4 == this.lastMove) return false;

  return true;
}

Vehicle.prototype.move = function() {
  var m = this.moves[this.ind];
  if (m == 0) this.y--;
  else if (m == 1) this.x++;
  else if (m == 2) this.y++;
  else this.x--;

  this.lastMove = m;
  this.ind++;
}

Vehicle.prototype.draw = function() {
  var [x, y] = [this.x * this.cellsize, this.y * this.cellsize];
  fill("white");
  ellipse(x + this.cellsize / 2, y + this.cellsize / 2, 10, 10);
}

Vehicle.prototype.mutate = function() {
  for (var i = 0; i < this.moves.length; i++) {
    if (Math.random() > this.mutationRate) {
      this.moves[i] = Math.floor(Math.random() * 4);
    }
  }
}

function Population(size, cellsize) {
  this.vehicles = [];
  this.size = size;
  this.cellsize = cellsize;
  this.board = [];
  this.currVehicle = null;
  this.currVehicleIndex = 0;
  this.totalFitness = 0;
}

Population.prototype.randomize = function() {
  for (var i = 0; i < this.size; i++) {
    var v = new Vehicle(this.cellsize);
    v.randomize();
    this.vehicles.push(v);
  }
  this.currVehicle = this.vehicles[0];
}

Population.prototype.setBoard = function(board) {
  this.board = board;
}

Population.prototype.draw = function() {
  this.currVehicle.draw();
}

Population.prototype.update = function() {
  if (this.currVehicle.alive) {
    if (this.currVehicle.canMove(this.board)) {
      this.currVehicle.move();
    }
    else {
      this.currVehicle.alive = false;
      this.currVehicle.maxDistance = this.currVehicle.ind;
    }
  }
  else {
    if (this.currVehicleIndex == this.size - 1) {
      this.geneticAlgorithm();
    }
    else {
      this.currVehicleIndex++;
      this.currVehicle = this.vehicles[this.currVehicleIndex];
    }
  }
}

Population.prototype.geneticAlgorithm = function() {
  // Calculate Individual fitnesses and total fitness
  this.calculateFitness();
  this.sort(); // Sorted from fittest to least
  this.mate();
  // RESET currVehicle, currVehicleIndex, totalFitneess
  this.reset();
}

Population.prototype.calculateFitness = function() {
  var totalFitness = 0;
  this.vehicles.forEach(function(v) {
    v.calculateFitness();
    totalFitness += v.fitness;
  });
  this.totalFitness = totalFitness;
}

Population.prototype.sort = function() {
  this.vehicles.sort(function(a, b) {
    return a.fitness - b.fitness;
  }).reverse();
}

Population.prototype.getParents = function() {
  var target = Math.floor(Math.random() * this.totalFitness);
  var val = 0;
  var ind1 = -1;

  while (val < target) {
    ind1++;
    val += this.vehicles[ind1].fitness;
  }

  target = Math.floor(Math.random() * this.totalFitness);
  val = 0;
  var ind2 = -1;

  while (val < target) {
    ind2++;
    val += this.vehicles[ind2].fitness;
  }

  if (ind1 == ind2) ind2 = (ind2 + 1) % this.size;
  if (ind1 == -1) ind1 = 0;
  if (ind2 == -1) ind2 = 0;

  console.log(ind1, ind2);
  return [this.vehicles[ind1], this.vehicles[ind2]];
}

Population.prototype.crossover = function(moves1, moves2) {
  var m = [];
  var cpoint = Math.floor(Math.random() * moves1.length);

  if (Math.random() > 0.5) {
    var temp = moves1;
    moves1 = moves2;
    moves2 = temp;
  }

  for (var i = 0; i < moves1.length; i++) {
    if (i < cpoint) m.push(moves1[i]);
    else m.push(moves2[i]);
  }
  return m;
}


Population.prototype.mate = function() {
  var newVehicles = [];

  // Elitism
  var best = this.vehicles[0];
  var v = new Vehicle(this.cellsize);
  v.setMoves(best.moves);
  newVehicles.push(v);

  for (var i = 1; i < this.size; i++) {
    var [p1, p2] = this.getParents();
    var m = this.crossover(p1.moves, p2.moves);
    v = new Vehicle(this.cellsize);
    v.setMoves(m);
    v.mutate();
    newVehicles.push(v);
  }
  this.vehicles = newVehicles;
}

Population.prototype.reset = function() {
  this.currVehicle = this.vehicles[0];
  this.currVehicleIndex = 0;
  this.totalFitneess = 0;
}
