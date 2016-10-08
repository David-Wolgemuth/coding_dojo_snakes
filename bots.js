(function (globals) {
    function cool_snake (map, snake) {
        // console.log(snake);
        // snake.saved.num = snake.saved.num ? snake.saved.num + 1 : 1;
        snake.saved.num = snake.saved.num || 1;
        if (snake.saved.num > 8) {
            // var t = snake.leftTile();
            // snake.saved.reversed = true;
        // if (!snake.saved.reversed) {
            // console.log("\n\nREVERSING\n\n")
            // var t = snake.backTile();
            // console.log(t.cdir);
            snake.saved.num = 1;
            // snake.saved.reversed = true;
            var t = snake.forwardTile();
            // console.log("DIRECTION:", t.cdir);
            return t.cdir;
        }
        // return t.cdir;
        // }
        // console.log(this);
        // console.log(this.is_valid());
        // throw "STOP";
        var t = snake.backTile();
        // console.log("DIRECTION:", t.cdir);
        return t.cdir;
        // return "?";
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
    globals.bots = [
        // {"name": "Westy", "move": function(){ return this.head.col - this.head.next.col == 1 ? "n" : "w" }},
        // {"name": "Northy", "move": function(){ return "n" }},
        // {"name": "Southy", "move": function(){ return "s" }},
        {"name": "RightSometimes", "move": cool_snake, },
        {"name": "RightSometimes", "move": cool_snake, },
        {"name": "RightSometimes", "move": cool_snake, },
        {"name": "RightSometimes", "move": cool_snake, },
        {"name": "RightSometimes", "move": cool_snake, },
        {"name": "RightSometimes", "move": cool_snake, },
        {"name": "RightSometimes", "move": cool_snake, },
        {"name": "RightOthertimes", "move": cool_snake, },
        // {"name": "random_snake", "move": random_snake},
        // {"name": "SnakeCamelA", "move": require("./snake-camel")}, 
        // {"name": "SnakeCamelB", "move": require("./snake-camel")}, //{"name": "SnakeCamelC", "move": snake_camel_case}, {"name": "SnakeCamelD", "move": snake_camel_case}, {"name": "SnakeCamelE", "move": snake_camel_case}, {"name": "SnakeCamelF", "move": snake_camel_case}, {"name": "SnakeCamelG", "move": snake_camel_case}, {"name": "SnakeCamelH", "move": snake_camel_case}, // {"name": "Diagonal", "move": diagonal}, // {"name": "greedy_snakeA", "move": greedy_snake},
        // {"name": "greedy_snakeB", "move": greedy_snake},
        // {"name": "greedy_snakeDC", "move": greedy_snake},
        // {"name": "greedy_snakeE", "move": greedy_snake},
        // {"name": "The spiraling snake will make you go insane (everyone wants to see that groovy thing)", "move": spiral},
        // {"name": "Don't spend the rest of your life wondering", "move": spiral},
        // {"name": "Putting all reason aside you decide to exchange what you've got for something hypnotic and strange", "move": spiral},
        // {"name": "Now that you've tried it you're back to deny it, the spiraling snake is a fraud and a fake", "move": spiral},
        // {"name": "apple_turnover", "move": apple_turnover}
    ];
})(this);
