var TIMER_INTERVAL = 62;
var SnakeGame = require("./game");
var angular = require("angular");

require("angular-route");
require("angular-ui-codemirror");

var snakeAppModule = angular.module("myApp", ["ngRoute", "ui.codemirror"]);

snakeAppModule.config(function ($routeProvider) {
    $routeProvider.when("/editor", {
        templateUrl: "views/editor.html"
    });
    $routeProvider.when("/arena", {
        templateUrl: "views/arena.html"
    });
    $routeProvider.when("/snakes", {
        templateUrl: "views/dashboard.html"
    });
    $routeProvider.when("/docs", {
        templateUrl: "views/docs.html"
    });
    $routeProvider.when("/", {
        templateUrl: "views/landing-page.html"
    });
});

snakeAppModule.factory("snakeTestingFactory", function () {
    var factory = {
        testSnake: 'if (utils.rand() < 0.5) {\n    return "s";\n} else {\n    return "e";\n}'
    };
    factory.getTestSnake = function () {
        return factory.testSnake;
    };
    factory.setTestSnake = function (code) {
        factory.testSnake = code;
    };
    return factory;
});

snakeAppModule.factory("arenaFactory", function () {
    var factory = {
        
    };
    factory.makeNewGame = function (bots) {
        factory.game = new SnakeGame(bots, true);
        factory.game.setup();
        return factory.game;
    };
    factory.getCurrentGame = function (code) {
        return factory.game;
    };
    return factory;
});

snakeAppModule.controller("masterController", function ($scope, $location) {
    $scope.currentTab = "";
    $scope.goToTab = function (tab) {
        $scope.currentTab = tab;
        $location.url("/" + tab);
    };
});

snakeAppModule.controller("arenaController", function(arenaFactory, snakeTestingFactory, $scope, $timeout, $location){

    var simpleSnake = `\n
        snake.saved.num = snake.saved.num || 1;
        // utils.print(snake.saved);
        if (snake.saved.num > 8) {
            snake.saved.num = 1;
            var rand = utils.rand();
            // utils.print(rand);
            if (rand < 0.5) {
                var t = snake.rightTile();
            } else {
                var t = snake.leftTile();
            }
            // utils.print(t);
            return t.cdir;
        }
        snake.saved.num += 1;
        var t = snake.forwardTile();
        return t.cdir
    \n`;

    var snakeBots = [{ move: makeSafeScript(simpleSnake), name: "simplyy" }];

    var testSnake = snakeTestingFactory.getTestSnake();
    if (!testSnake) {
        return;
    }

    snakeBots.push({
        move: makeSafeScript(testSnake),
        name: "Tester"
    });

    var game = arenaFactory.getCurrentGame();
    if (!game) {
        game = arenaFactory.makeNewGame(snakeBots);
    }

    var timer;

    function runFrame () {
        if ($location.url().indexOf("arena") < 0) {
            // game.paused = true;
            return;
        }
        if (game.runFrame()) {
            $scope.curr_frame = game.lastFrame();
            $timeout(runFrame, TIMER_INTERVAL);
        }
    }

    runFrame();
});

snakeAppModule.controller("editorController", function (snakeTestingFactory, $scope, $location) {
    $scope.editorOptions = {
        mode: "javascript",
        lineNumbers: true,
        matchBrackets: true,
        keyMap: "sublime",
        indentUnit: 4,
        extraKeys:{
            Tab: function (cm) {
                if (cm.options.indentWithTabs) {
                    cm.execCommand("insertTab");
                } else {
                    cm.execCommand("insertSoftTab");
                }
            }
        },
        theme: "lesser-dark"
    };
    $scope.snakeCode = {text: snakeTestingFactory.getTestSnake()};
    $scope.testSnake = function (code) {
        snakeTestingFactory.setTestSnake(code);
        $location.url("/arena?test-snake=true");
    };
    // $scope.currentColorTheme = "lesser-dark";
    $scope.colorThemes = ["3024-day", "3024-night", "abcdef", "ambiance-mobile", "ambiance", "base16-dark", "base16-light", "bespin", "blackboard", "cobalt", "colorforth", "dracula", "eclipse", "elegant", "erlang-dark", "hopscotch", "icecoder", "isotope", "lesser-dark", "liquibyte", "material", "mbo", "mdn-like", "midnight", "monokai", "neat", "neo", "night", "panda-syntax", "paraiso-dark", "paraiso-light", "pastel-on-dark", "railscasts", "rubyblue", "seti", "solarized", "the-matrix", "tomorrow-night-bright", "tomorrow-night-eighties", "ttcn", "twilight", "vibrant-ink", "xq-dark", "xq-light", "yeti", "zenburn"];
})

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
            console.log("RES:", res);
            return res;
        } catch (error) {
            console.log("ERROR IN CODE", error);
            return "?";
        }

    };
}