
var fs = require("fs");
var Snake = require("./snake.js");
var _u = require("./utilities")();

function SnakeGame (bots, keepLog)
{
	this.bots = bots;
	this.startingLength = 3;
	this.gridSize = this.bots.length*10
	this.numberOfApples = Math.pow(this.gridSize,2)/4
	this.maxTurns = 500;
	this.keepLog = keepLog;
	this.scores = {};
	this.snakes = []

	this.run = function () {

		if(this.keepLog){
			log = []
		}

		this.grid = _u.emptyGrid(this.gridSize, ".")

		var moves = {
			"n": [-1,0],
			"e": [0,1],
			"s": [1,0],
			"w": [0,-1],
		}

		_u.shuffleArray(this.bots)

		// Make and place snakes


		for (var i = 0; i < this.bots.length; i++) {
			var new_snake = new Snake(this.bots[i].move, String.fromCharCode(97+i))
			new_snake.name = this.bots[i].name
			new_snake.timeout = 0
			new_snake.score = 0

			var start = i*10+4

			for (var j = 0; j < this.startingLength; j++) {
				new_snake.add_head(start, start+j)
				this.grid[start][start+j] = new_snake.letter
			};

			this.grid[new_snake.head.row][new_snake.head.col] = new_snake.letter.toUpperCase()

			this.snakes.push(new_snake)
			this.scores[new_snake.name+" "+new_snake.letter] = this.snakes[this.snakes.length-1].score;
		};

		// Place starting apples

		for(var i = 0; i < this.numberOfApples; i++){
			var empty = this.findEmptyCell()
			this.grid[empty[0]][empty[1]] = "*"
		}

		if(this.keepLog){
			log.push({grid: _u.shallowCopy(this.grid), scores: _u.shallowCopy(this.scores) });
		}


		while(this.snakes && this.maxTurns && this.numberOfApples){
			this.maxTurns--

			for (var i = 0; i < this.snakes.length; i++) {
				if(this.snakes[i].timeout){ 
					this.snakes[i].timeout-- 
				} else {			
					var move = this.snakes[i].move(this.makeMap(this.snakes[i])).toLowerCase()
					next = this.findNewCell(this.snakes[i], moves[move])
					this.moveToCell(this.snakes[i], next[0], next[1])

					if(this.keepLog){
						log.push({ grid: _u.shallowCopy(this.grid), "scores": _u.shallowCopy(this.scores) });
					}
				}
			};
		}

		if(this.keepLog){
			var output = "var log = " + JSON.stringify(log, null, "\t")
			fs.writeFile("log.js", output, function(err){
				if(err){ console.log("Error while saving", err)}
			});
		}
	};

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
			snake.add_head(row, col);
			this.grid[snake.head.row][snake.head.col] = snake.letter.toUpperCase();

			if(newCell==".") {
				this.grid[snake.tail.row][snake.tail.col] = ".";
				snake.remove_tail();
			} else {
				this.numberOfApples--;
				this.scores[snake.name+" "+snake.letter] = snake.score;
			}

			snake.score++;
			// this.snakes[i].timeout = this.snakes[i].length;
		}
	}

	this.getDefaultMove = function snakeGameGetDefaultMove (snake)
	{
		row_diff = snake.head.row - snake.head.next.row;
		col_diff = snake.head.col - snake.head.next.col;

		next = [_u.mod(snake.head.row + row_diff, this.gridSize), _u.mod(snake.head.col + col_diff, this.gridSize)]

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

function greedy_snake(map){
	if(map[_u.mod(this.head.row-1, map.length)][this.head.col]=="*"){
		return "n"
	} else if(map[_u.mod(this.head.row+1, map.length)][this.head.col]=="*") {
		return "s"
	} else if(map[this.head.row][_u.mod(this.head.col-1, map.length)]=="*") {
		return "w"
	} else if(map[this.head.row][_u.mod(this.head.col+1, map.length)]=="*") {
		return "e"
	} else {
		return "?"
	}
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


function cool_snake (map, snake) {
	// console.log(snake);
	// snake.saved.num = snake.saved.num ? snake.saved.num + 1 : 1;
	// if (snake.saved.num > 60) {
		// var t = snake.leftTile();
		// snake.saved.reversed = true;
	// if (!snake.saved.reversed) {
		// console.log("\n\nREVERSING\n\n")
		var t = snake.backTile();
		// console.log(t.cdir);
		// snake.saved.num = 1;
		snake.saved.reversed = true;
		return t.cdir;
	// }
	// console.log(this);
	// console.log(this.is_valid());
	// throw "STOP";
	var t = snake.forwardTile();
	console.log("DIRECTION:", t.cdir);
	return t.cdir;
	// return "?";
}

var bots = [
	// {"name": "Westy", "move": function(){ return this.head.col - this.head.next.col == 1 ? "n" : "w" }},
	// {"name": "Northy", "move": function(){ return "n" }},
	// {"name": "Southy", "move": function(){ return "s" }},
	// {"name": "RightSometimes", "move": cool_snake, },
	{"name": "RightOthertimes", "move": cool_snake, },
	// {"name": "random_snake", "move": random_snake},
	// {"name": "SnakeCamelA", "move": snake_camel_case}, {"name": "SnakeCamelB", "move": snake_camel_case}, {"name": "SnakeCamelC", "move": snake_camel_case}, {"name": "SnakeCamelD", "move": snake_camel_case}, {"name": "SnakeCamelE", "move": snake_camel_case}, {"name": "SnakeCamelF", "move": snake_camel_case}, {"name": "SnakeCamelG", "move": snake_camel_case}, {"name": "SnakeCamelH", "move": snake_camel_case}, // {"name": "Diagonal", "move": diagonal}, // {"name": "greedy_snakeA", "move": greedy_snake},
	// {"name": "greedy_snakeB", "move": greedy_snake},
	// {"name": "greedy_snakeDC", "move": greedy_snake},
	{"name": "greedy_snakeE", "move": greedy_snake},
	// {"name": "The spiraling snake will make you go insane (everyone wants to see that groovy thing)", "move": spiral},
	// {"name": "Don't spend the rest of your life wondering", "move": spiral},
	// {"name": "Putting all reason aside you decide to exchange what you've got for something hypnotic and strange", "move": spiral},
	// {"name": "Now that you've tried it you're back to deny it, the spiraling snake is a fraud and a fake", "move": spiral},
	// {"name": "apple_turnover", "move": apple_turnover}
]

var game = new SnakeGame(bots, this.keepLog=true)
game.run();

// console.log(play_many_games(bots))

/* Snake import test
var my_snake = new Snake()

my_snake.add_head(0,1)
my_snake.add_tail(1,1)
my_snake.add_tail(2,1)
my_snake.add_head(0,0)

console.log(my_snake.is_valid())
console.log(my_snake.print())

my_snake.remove_tail()
my_snake.remove_head()

console.log(my_snake.is_valid())
console.log(my_snake.print())
*/ 
