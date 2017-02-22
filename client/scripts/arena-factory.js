
var SnakeGame = require("./game");
module.exports = [
function ArenaFactory () {
    var factory = {};

    factory.makeNewTest = function (snake) {
        console.log("SNAKE:", snake);
        var simpleSnake = `\n
            snake.saved.num = snake.saved.num || 1;
            if (snake.saved.num > 8) {
                snake.saved.num = 1;
                var rand = utils.rand();
                if (rand < 0.5) {
                    var t = snake.getRightTile();
                } else {
                    var t = snake.getLeftTile();
                }
                return t.cdir;
            }
            snake.saved.num += 1;
            var t = snake.getForwardTile();
            return t.cdir
        \n`;
        var snakeBots = [
            { content: simpleSnake, name: "TEST_BOT_9000", color: "#a1a1a1" },
            snake
        ];
        factory.makeNewGame(snakeBots, true);
    };
    factory.makeNewGame = function (snakes, testing) {
        var bots = [];
        var consoleLog = [];  // This is where snakes print to
        for (var i = 0; i < snakes.length; i++) {
            bots.push({
                move: makeSafeScript(snakes[i], consoleLog),
                name: snakes[i].name,
                color: snakes[i].color
            });
        }
        factory.game = new SnakeGame(bots, true);
        factory.game.consoleLog = consoleLog;
        factory.game.testing = testing || false;
        factory.game.setup();
        console.log(factory.game);
        return factory.game;
    };
    factory.getCurrentGame = function (code) {
        return factory.game;
    };
    return factory;
}];

function makeSafeScript (snake, consoleLog) {
    var vm = require("vm");

    var nullify = "";
    var globals = Object.getOwnPropertyNames(window);
    for (var i = 0; i < globals.length; i++) {
        nullify += `var ${globals[i]}=null;`;
    }
    var scriptStart = "\n\nfunction getMove (snake, map, utils) { var window=null;";
    var scriptEnd = "\n}\ngetMove.call(snake, snake, map, utils);";

    var scriptCode = nullify + scriptStart + snake.content + scriptEnd;

    var utils = {
        print: function () {
            var args = arguments;
            args.snake = snake;
            consoleLog.push(args);
        },
        mod: function (a, b) {
            return (( a % b ) + b) % b;
        },
        rand: function () {
            return Math.random();
        },
        floor: function (x) {
            return Math.floor(x);
        },
        round: function (x) {
            return Math.round(x);
        }
    };

    var script =  new vm.Script(scriptCode);
    
    return function getMove (map, snake) {
        var context = new vm.createContext({
            snake: snake,
            map: map,
            utils: utils
        });

        try {
            var res = script.runInContext(context);
            return res;
        } catch (error) {
            console.log("ERROR IN CODE", error);
            return "?";
        }

    };
}