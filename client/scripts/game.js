
var fs = require("fs");
var Snake = require("./snake.js");
var _u = require("./utilities")();

module.exports = function SnakeGame (bots)
{
	this.bots = bots;
	this.startingLength = 3;
	this.gridSize = this.bots.length*10
	this.numberOfApples = Math.pow(this.gridSize,2)/4
	this.maxTurns = 500;
	// this.keepLog = keepLog;
	this.scores = {};
	this.snakes = [];
	this.log = [];

	this.run = function () {

		this.grid = _u.emptyGrid(this.gridSize, ".");

		var moves = {
			"n": [-1,  0],
			"e": [ 0,  1],
			"s": [ 1,  0],
			"w": [ 0, -1]
		};

		this.addSnakes();

		// Place starting apples

		for (var i = 0; i < this.numberOfApples; i++) {
			var empty = this.findEmptyCell();
			this.grid[empty[0]][empty[1]] = "*";
		}

		this.log.push({grid: _u.shallowCopy(this.grid), scores: _u.shallowCopy(this.scores) });

		while (this.snakes && this.maxTurns && this.numberOfApples) {
			this.maxTurns -= 1;

			if (this.maxTurns % 24 === 0) {
				console.log(Math.floor((500-this.maxTurns) / 5), "%");
			}

			for (var i = 0; i < this.snakes.length; i++) {
				if (this.snakes[i].timeout) { 
					this.snakes[i].timeout -= 1;
				} else {			
					var move = this.snakes[i].move(this.makeMap(this.snakes[i])).toLowerCase()
					next = this.findNewCell(this.snakes[i], moves[move])
					this.moveToCell(this.snakes[i], next[0], next[1])

					this.log.push({ grid: _u.shallowCopy(this.grid), "scores": _u.shallowCopy(this.scores) });
				}
			}
		}

		if(this.keepLog){
			this.writeLog();
		}
	};

	this.addSnakes = function snakeGameAddSnakes () {
		_u.shuffleArray(this.bots);

		for (var i = 0; i < this.bots.length; i++) {
			var newSnake = new Snake(this.bots[i].move, String.fromCharCode(97+i));
			newSnake.name = this.bots[i].name;
			newSnake.timeout = 0;
			newSnake.score = 0;

			var start = 10*i + 4;

			for (var j = 0; j < this.startingLength; j++) {
				newSnake.addHead(start, start+j);
				this.grid[start][start+j] = newSnake.letter;
			}

			this.grid[newSnake.head.row][newSnake.head.col] = newSnake.letter.toUpperCase()

			this.snakes.push(newSnake)
			this.scores[newSnake.name+" "+newSnake.letter] = this.snakes[this.snakes.length-1].score;
		};
	};

	this.writeLog = function snakeGameWriteLog () {
		var output = "var log = " + JSON.stringify(log, null, "\t")
		fs.writeFile("log.js", output, function(err){
			if(err){ console.log("Error while saving", err)}
		});
	}

	this.makeMap = function snake_game_makeMap (snake)
	{
		var map = _u.emptyGrid(this.bots.length*10, "?");

		var view_span = snake.length;

		for(var i = -view_span; i <= view_span; i++){
			for (var j = -view_span; j <= view_span; j++) {
				cell_row = _u.mod(snake.head.row+i, map.length);
				cell_col = _u.mod(snake.head.col+j, map[cell_row].length);
				map[cell_row][cell_col] = this.grid[cell_row][cell_col];
			}
		}

		return map;
	};

	this.findEmptyCell = function snakeGameFindEmptyCell ()
	{
		row = Math.floor(Math.random()*this.gridSize);
		col = Math.floor(Math.random()*this.gridSize);

		while (this.grid[row][col] != ".") {
			row = Math.floor(Math.random()*this.gridSize);
			col = Math.floor(Math.random()*this.gridSize);
		}

		return [row, col];
	};

	this.killSnake = function snakeGameKillSnake (snake)
	{
		var runner = snake.head;
		while (runner) {
			this.grid[runner.row][runner.col] = snake.letter.toUpperCase();
			runner = runner.next;
		}
		snake_index = this.snakes.indexOf(snake);
		if (snake_index > -1) {
			this.snakes.splice(snake_index, 1);
		}
	};

	this.moveToCell = function snakeGameMoveToCell (snake, row, col)
	{
		var newCell = this.grid[row][col];

		if (newCell !== "*" && newCell !== ".") {
			this.killSnake(snake);
		} else {
			this.grid[snake.head.row][snake.head.col] = snake.letter;
			snake.addHead(row, col);
			this.grid[snake.head.row][snake.head.col] = snake.letter.toUpperCase();

			if(newCell==".") {
				this.grid[snake.tail.row][snake.tail.col] = ".";
				snake.removeTail();
			} else {
				this.numberOfApples -= 1;
				var id = snake.name + " " + snake.letter;
				this.scores[id] = snake.score;
			}

			snake.score += 1;
		}
	};

	this.getDefaultMove = function snakeGameGetDefaultMove (snake)
	{
		row_diff = snake.head.row - snake.head.next.row;
		col_diff = snake.head.col - snake.head.next.col;

		next = [_u.mod(snake.head.row + row_diff, this.gridSize), _u.mod(snake.head.col + col_diff, this.gridSize)];

		return next;
	};

	this.findNewCell = function snakeGameFindNewCell (snake, deltas)
	{
		if(!deltas){
			return this.getDefaultMove(snake);
		}

		next = [_u.mod(snake.head.row + deltas[0], this.gridSize), _u.mod(snake.head.col + deltas[1], this.gridSize)];

		if (next[0] === snake.head.next.row && next[1] === snake.head.next.col) {
			// snake.reverse();
			return this.getDefaultMove(snake);
		} else {
			return next;
		}
	};

}

// function play_many_games(number_of_games){
// 	if(!number_of_games){ number_of_games = 100 }
	
// 	running_totals = {}

// 	for(var i = 0; i < this.bots.length; i++){
// 		running_totals[this.bots[i].name] = 0
// 	}

// 	for(var games = 0; games < 100; games++){
// 		var scores = snakes(this.bots)
// 		for(var bot in scores){
// 			running_totals[bot.slice(0,-2)] += scores[bot]
// 		}
// 	}

// 	return running_totals
// }

// Bots go here
function random_snake(){
	return "NEWS"[Math.floor(Math.random()*4)] 
}



function diagonal(){
	this.last_north = !this.last_north
	if(this.last_north){
		if (Math.random() < 0.5) {
			return "s";
		}
		return "e"
	} else {
		return "n"
	}
}

function spiral(){
	// This could lead to excellence, or serious injury
	// https://www.youtube.com/watch?v=2aeOBZ7gVPY
	if(!this.dir_index){ this.dir_index = 1 }
	if(!this.side_length){ this.side_length = 3}
	if(!this.counter){ 
		this.counter = Math.ceil(this.side_length/this.length)
		this.side_length++
	} else {
		this.counter--
	}
	
	dirs = ["e", "n", "w", "s"]

	return dirs[this.side_length % 4]
}

function apple_turnover(){
	// Turns every time it eats an apple
	dirs = ["e", "s", "w", "n"]
	return dirs[this.score % 4]
}





// console.log(play_many_games(bots))

/* Snake import test
var my_snake = new Snake()

my_snake.addHead(0,1)
my_snake.addTail(1,1)
my_snake.addTail(2,1)
my_snake.addHead(0,0)

console.log(my_snake.is_valid())
console.log(my_snake.print())

my_snake.removeTail()
my_snake.removeHead()

console.log(my_snake.is_valid())
console.log(my_snake.print())
*/ 