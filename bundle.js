(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TIMER_INTERVAL = 62;
var SnakeGame = require("./game");

var myAppModule = angular.module("myApp", []);
myAppModule.controller("snakeController", function($scope, $interval){

    var game = new SnakeGame(bots, true);
    game.run();

    $scope.frame = -1;

    function changeGrid(){
        $scope.frame++;

        if ($scope.frame == game.log.length) {
            $interval.cancel(timer);
        } else {
            $scope.curr_frame = game.log[$scope.frame];
        }
    }

    timer = $interval(changeGrid, TIMER_INTERVAL);

    $scope.$on("$destroy", function() {
        $interval.cancel(timer);
    });
});
},{"./game":2}],2:[function(require,module,exports){

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

},{"./snake.js":3,"./utilities":4,"fs":5}],3:[function(require,module,exports){
module.exports = function Snake (move_function, letter) {
	// Snake implemented as a doubly-linked list for easily adding a new head and removing the tail
	this.head = null;
	this.tail = null;
	this.length = 0;
	this.saved = {};
	this.direction = 1;
	this.move = function (map) {
		var snake = new UserSnake(this, map);
		return move_function.call(this, map, snake);
	};

	this.letter = letter;

	this.addHead = function (row, col) {
		this.length += 1;

		if (!this.head) {
			this.head = new SnakeNode(row, col);
			this.tail = this.head;
		} else {
			var new_head = new SnakeNode(row, col);
			this.head.prev = new_head;
			new_head.next = this.head;
			this.head = new_head;
		}

		return this;
	};

	this.addTail = function (row, col) {
		this.length++;

		if (!this.tail) {
			this.tail = new SnakeNode(row, col);
			this.head = this.tail;
		} else {
			var new_tail = new SnakeNode(row, col);
			this.tail.next = new_tail;
			new_tail.prev = this.tail;
			this.tail = new_tail;
		}

		return this;
	};

	this.reverse = function () {
		if (!this.head) { return; }

		var curr = this.head;
		var prev = this.head.next;

		while (curr) {
			var next = curr.next;

			curr.next = prev;
			curr.prev = next;

			prev = curr;
			curr = next;
		}

		var head = this.head;
		this.head = prev;
		this.tail = head;
		this.tail.next = null;
	};

	this.removeHead = function () {
		if (!this.head) {
			return this;
		}

		this.length -= 1;
		this.head = this.head.next

		if(this.head){
			this.head.prev = null
		}

		return this
	}

	this.removeTail = function(){
		if(!this.tail){ return this }

		this.length--
		this.tail = this.tail.prev

		if(this.tail){
			this.tail.next = null
		}

		return this
	}

	this.is_valid = function(){
		if(!this.head && !this.tail){
			return true
		} else if(!this.head || !this.tail) {
			return false
		} else if(this.head.prev || this.tail.next){
			return false
		}

		var runner = this.head
		var count = 1

		while(runner.next){
			if(runner.next.prev != runner){
				return false
			}
			runner = runner.next
			count ++
		}

		return runner==this.tail&&count==this.length
	}

	this.print = function(){
		if(!this.is_valid){
			return "Invalid snake"
		}

		var runner = this.head 

		output = `(head) [${runner.row}, ${runner.col}]`

		while(runner.next){
			output += ` <-> [${runner.next.row}, ${runner.next.col}]`
			runner = runner.next
		}

		output += " (tail)"

		// console.log(output)
		return output
	}
}

function UserSnake (snake, map) {
	this.letter = snake.letter;
	this.map = map;
	this.saved = snake.saved;
	this.head = function () {
		return snake.head.coords();
	}
	this.tail = function () {
		return snake.tail.coords();
	}
	var dirMethods = ["forward", "back", "left", "right"];
	for (var i = 0; i < dirMethods.length; i++) {
		// this.forwardTile = function () { using "f" as direction }
		this[dirMethods[i] + "Tile"] = makeDirectionalMethod(dirMethods[i][0]);
	}
	function makeDirectionalMethod (dir) {
		return function () {
			return new Tile (snake, this.map, dir);
		}
	}
}


function Tile (snake, map, relativeDirection) {
	this.rdir 	= relativeDirection;
	this.cdir 	= "?";
	this.row  	= 0;
	this.col 	= 0;
	this.letter = "?";
	this.init(snake, map)
}
Tile.prototype.init = function (snake, map) {
	var forwardDelta = determineForwardDelta(snake);
	var delta = determineDeltaFromRelative (forwardDelta, this.rdir);

	this.cdir = determineCardinalDirectionFromDelta(delta);
	this.row  = snake.head.row + delta.row;
	this.col  = snake.head.col + delta.col;
}

function determineForwardDelta (snake) {
	return { 
		row: snake.head.next.row - snake.head.row,
		col: snake.head.next.col - snake.head.col 
	};
}
function determineDeltaFromRelative (forwardDelta, rdir) {
	if (rdir === "l" || rdir === "r") {
		var row, col;
		var neg = (rdir === "l") ? -1 : 1;
		if (forwardDelta.row) {
			col = forwardDelta.row * neg;
			row = 0;
		} else {
			col = 0;
			row = -forwardDelta.col * neg;
		}
		return { row: row, col: col };
	} else {
		switch (rdir) {
			case "f":
				return forwardDelta;
			case "b":
				return { row: -forwardDelta.row, col: -forwardDelta.col };
			default:
				return "?";
		}
	}
}

function determineCardinalDirectionFromDelta (delta) {
	if (typeof delta.row !== "number" || typeof delta.col !== "number") {
		return "?";
	}
	if (!delta.row) {
		return (delta.col > 0) ? "e" : "w";
	}
	return (delta.row > 0) ? "s" : "n";
}


function SnakeNode(row, col){
	this.row = row
	this.col = col
	this.next = null
	this.prev = null
}
SnakeNode.prototype.coords = function () {
	return { row: this.row, col: this.col };
}
},{}],4:[function(require,module,exports){

module.exports = function () {
    return {
        shuffleArray: function shuffleArray(arr)
        {
            // JS implementation of the Durstenfeld shuffle by StackOverflow user Laurens Holst
            // http://stackoverflow.com/a/12646864/5749040

            for (var i = arr.length-1; i>0; i--) {
                var j = Math.floor(Math.random()*(i+1));
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        },
        mod: function mod(a,b){
            // Make % work for negative numbers
            return ( (a%b) + b) % b;
        },
        shallowCopy: function shallowCopy(obj){
            // Kludgy function to deep copy an array or object (so that any sub-arrays/objects will be copies, not references to the original)
            // This will break if the object holds any non-JSONible data (functions, undefined, and such), but that shouldn't be an issue for this project
            return JSON.parse(JSON.stringify(obj));
        },
        emptyGrid: function emptyGrid(size, f){
            if (!f) {
                f = ".";
            }
            var new_grid = new Array(size);
            for (var i = 0; i < new_grid.length; i++) {
                new_grid[i] = new Array(size).fill(f);
            }
            return new_grid;
        }
    };
};
},{}],5:[function(require,module,exports){

},{}]},{},[1]);
