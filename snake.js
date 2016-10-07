module.exports = function Snake(move_function, letter){
	// Snake implemented as a doubly-linked list for easily adding a new head and removing the tail
	this.head = null
	this.tail = null
	this.length = 0
	this.saved = {};
	this.direction = 1;
	this.move = function (map) {
		var snake = new UserSnake(this, map);
		return move_function.call(this, map, snake);
	};

	this.letter = letter

	this.add_head = function(row, col){
		this.length++

		if(!this.head){
			this.head = new SnakeNode(row, col)
			this.tail = this.head
		} else {
			var new_head = new SnakeNode(row, col)
			this.head.prev = new_head
			new_head.next = this.head 
			this.head = new_head
		}

		return this
	}

	this.add_tail = function(row, col){
		this.length++

		if(!this.tail){
			this.tail = new SnakeNode(row, col)
			this.head = this.tail
		} else {
			var new_tail = new SnakeNode(row, col)
			this.tail.next = new_tail
			new_tail.prev = this.tail
			this.tail = new_tail
		}

		return this
	}

	this.reverse = function () {
		var listString = ""
		for (var curr = this.head; curr; curr = curr.next) {
			listString += "(" + curr.row + ", " + curr.col + ")";
		}
		// console.log(listString, " ----- ");

		// console.log(this.head.coords());

		if (!this.head) { return; }

		var curr = this.head;
		var prev = this.head.next;

		while (curr) {
			// console.log("CHANGING:")
			// console.log("CURR:", curr.coords());
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

		var listString = ""
		for (var curr = this.head; curr; curr = curr.next) {
			listString += "(" + curr.row + ", " + curr.col + ")";
		}
		// console.log(listString);
		// console.log("HEAD:", this.head);
		// console.log("TAIL:", this.tail);
		// throw "FUCK YOU EVERYONE";
	}

	this.remove_head = function(){
		if(!this.head){ return this }

		this.length--
		this.head = this.head.next

		if(this.head){
			this.head.prev = null
		}

		return this
	}

	this.remove_tail = function(){
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