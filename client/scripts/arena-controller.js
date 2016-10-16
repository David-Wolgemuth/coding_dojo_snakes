module.exports = ["arenaFactory", "snakeFactory", "$scope", "$timeout", "$location", "$routeParams",
function ArenaController (Arena, Snake, $scope, $timeout, $location, $routeParams)
{
    $scope.$parent.setCurrentTab("arena");
    $scope.timeInterval = 62;
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

    $scope.testingSnake = !!$routeParams["test-snake"];
    $scope.paused = true;

    console.log($scope.testingSnake);

    $scope.togglePause = function () { 
        $scope.paused = !$scope.paused;
        if (!$scope.paused) {
            runFrame();
        }
    };

    var snakeBots = [{ move: makeSafeScript(simpleSnake), name: "simplyy" }];

    var currentSnakeContent = Snake.currentSnakeContent;
    if (!currentSnakeContent) {
        return;
    }

    snakeBots.push({
        move: makeSafeScript(currentSnakeContent),
        name: "Tester"
    });

    var game = Arena.getCurrentGame();
    if (!game || $scope.testingSnake) {
        game = Arena.makeNewGame(snakeBots);
    }

    var timer;


    function runFrame () {
        if ($location.url().indexOf("arena") < 0 || $scope.paused) {
            return;
        }
        if (game.runFrame()) {
            $scope.curr_frame = game.lastFrame();
            $timeout(runFrame, $scope.timeInterval);
        }
    }

    game.runFrame();
    $scope.curr_frame = game.lastFrame();
    
    runFrame();
}];

function makeSafeScript (scriptBody) {
    var vm = require("vm");

    var nullify = "";
    var globals = Object.getOwnPropertyNames(window);
    for (var i = 0; i < globals.length; i++) {
        nullify += `var ${globals[i]}=null;`;
    }
    var scriptStart = "\n\nfunction getMove (snake, map, utils) { var window=null; var global=null;";
    var scriptEnd = "\n}\ngetMove.call(snake, snake, map, utils);";

    var scriptCode = nullify + scriptStart + scriptBody + scriptEnd;

    var utils = {
        print: function () {
            console.log("LOG", arguments);
        },
        mod: function (a, b) {
            return ( ( a%b ) + b) % b;
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
    }

    console.log("UTILS:", utils);

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