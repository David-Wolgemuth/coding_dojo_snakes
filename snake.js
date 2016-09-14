module.exports = function Snake(move_function, letter){
	// Snake implemented as a doubly-linked list for easily adding a new head and removing the tail
	this.head = null
	this.tail = null
	this.length = 0
	this.move = move_function
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

		console.log(output)
		return output
	}
}

function SnakeNode(row, col){
	this.row = row
	this.col = col
	this.next = null
	this.prev = null
}