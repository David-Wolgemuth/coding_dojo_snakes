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
		if (!this.head && !this.tail) {
			return true;
		} else if (!this.head || !this.tail) {
			return false;
		} else if (this.head.prev || this.tail.next) {
			return false;
		}

		var runner = this.head;
		var count = 1;

		while (runner.next) {
			if (runner.next.prev != runner) {
				return false;
			}
			runner = runner.next;
			count ++;
		}

		return (runner === this.tail && count === this.length);
	};

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
	this.getHeadCoords = function () {
		return snake.head.coords();
	};
	this.getTailCoords = function () {
		return snake.tail.coords();
	};
	var dirMethods = ["Forward", "Left", "Right"];
	for (var i = 0; i < dirMethods.length; i++) {
		// this.forwardTile = function () { using "f" as direction }
		this["get" + dirMethods[i] + "Tile"] = makeDirectionalMethod(dirMethods[i][0].toLowerCase());
	}
	function makeDirectionalMethod (dir) {
		return function () {
			return new Tile (snake, this.map, dir);
		};
	}
}

function Tile (snake, map, relativeDirection)
{
	this.rdir 	= relativeDirection;
	this.cdir 	= "?";
	this.row  	= 0;
	this.col 	= 0;
	this.letter = "?";
	this.init(snake, map);
}

Tile.prototype.init = function (snake, map)
{
	var forwardDelta = determineForwardDelta(snake);
	var delta = determineDeltaFromRelative (forwardDelta, this.rdir);

	this.cdir = determineCardinalDirectionFromDelta(delta);
	this.row  = snake.head.row + delta.row;
	this.col  = snake.head.col + delta.col;
};

function determineForwardDelta (snake)
{
	var d = { 
		row: snake.head.next.row - snake.head.row,
		col: snake.head.next.col - snake.head.col 
	};
	console.log(d);
	return d;
}

function determineDeltaFromRelative (forwardDelta, rdir)
{
	// Rotate the delta based on relative direction
	var row = forwardDelta.row;
	var col = forwardDelta.col;
	switch (rdir) {
		case "f":
			// Same
			return forwardDelta;
		case "l":
			return { row: col, col: -row };
		case "r":
			return { row: -col, col: row };
		default:
			return "?";
	}
}

function determineCardinalDirectionFromDelta (delta)
{
	if (typeof delta.row !== "number" || typeof delta.col !== "number") {
		return "?";
	}
	if (!delta.row) {
		return (delta.col > 0) ? "e" : "w";
	}
	return (delta.row > 0) ? "s" : "n";
}

function SnakeNode(row, col)
{
	this.row = row;
	this.col = col;
	this.next = null;
	this.prev = null;
}

SnakeNode.prototype.coords = function ()
{
	// Safe getter for coords
	return { row: this.row, col: this.col };
};
