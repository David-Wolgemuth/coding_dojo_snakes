var SnakeGame = require("./game");
var angular = require("angular");

require("angular-route");
require("angular-ui-codemirror");
require("angularjs-color-picker")

var snakeAppModule = angular.module("myApp", ["ngRoute", "ui.codemirror", "color.picker"]);

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

snakeAppModule.factory("userFactory", function ($http) {
    var factory = {};
    factory.me = null;
    factory.whoAmI = function (callback) {
        $http({
            method: "GET",
            url: "/me"
        }).then(function (res) {
            console.log(res);
            if (res.data.user) {
                factory.me = res.data.user;
                callback(factory.me);
            } else {
                factory.me = null;
                callback(null);
            }
        }).catch(function () { callback(null); });
    };
    factory.login = function (data, callback) {
        $http({
            method: "POST",
            url: "/login",
            data: data
        }).then(function (res) {
            console.log("RES:", res);
            factory.me = res.data.user;
            callback(null, res.data.user);
        }).catch(function (res) {
            console.log("ERR:", res.data.message);
            callback(res.data.message, null);  
            factory.me = null;
        });
    };
    factory.signOut = function (callback) {
        $http({
            method: "GET",
            url: "/logout"
        }).then(function (res) {
            factory.me = null;
            callback();
        }).catch(function (res) {
            callback(res);
        });
    };
    factory.register = function (data, callback) {
        console.log("OUTGOING:", data);
        $http({
            method: "POST",
            url: "/users",
            data: data
        }).then(function (res) {
            console.log("RES:", res);
            factory.me = res.data.user;
            callback(null, res.data.user);
        }).catch(function (res) {
            console.log("ERR:", res.data.message);
            callback(res.data.message, null);  
            factory.me = null;
        });
    };
    return factory;
});

snakeAppModule.factory("editorFactory", function ($http) {
    var factory = {
        currentSnakeContent: 'if (utils.rand() > 0.1) {\n    return "s";\n} else {\n    var left = snake.getLeftTile();\n    utils.print("GOING LEFT!");\n    return left.cdir;\n}',
        currentSnakeId: null
    };
    factory.loadEditorSettings = function () {
        return $http({
            method: "GET",
            url: "/editorSettings"
        }).then(function (res) {
            if (res.data.settings) {
                factory.keyMap = res.data.settings.keyMap;
                factory.theme = res.data.settings.theme;
            }
        });
    };
    factory.saveEditorSettings = function (options) {
        factory.keyMap = options.keyMap;
        factory.theme = options.theme;
        console.log(options);
        $http({
            method: "POST",
            url: "/editorSettings",
            data: { keyMap: factory.keyMap, theme: factory.theme }
        }).then(function (res) {
            console.log(res);
        });
    };
    return factory;
});

snakeAppModule.factory("snakeFactory", function ($http) {
    var factory = {};
    factory.save = function (snake, callback) {
        $http({
            method: "POST",
            url: "/snakes",
            data: snake
        }).then(function (res) {
            console.log(null, res.data.snake);
        }).catch(function (res) {
            console.log(res.data.message);
        });
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
    $scope.setCurrentTab = function (tab) {
        $scope.currentTab = tab;
    };
    $scope.goToTab = function (tab) {
        $scope.currentTab = tab;
        $location.url("/" + tab);
    };
});

snakeAppModule.controller("arenaController", function(arenaFactory, editorFactory, $scope, $timeout, $location, $routeParams){
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

    var currentSnakeContent = editorFactory.currentSnakeContent;
    if (!currentSnakeContent) {
        return;
    }

    snakeBots.push({
        move: makeSafeScript(currentSnakeContent),
        name: "Tester"
    });

    var game = arenaFactory.getCurrentGame();
    if (!game || $scope.testingSnake) {
        game = arenaFactory.makeNewGame(snakeBots);
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
});

snakeAppModule.controller("editorController", function (editorFactory, snakeFactory, userFactory, $scope, $location) {
    $scope.$parent.setCurrentTab("editor");
    $scope.editorOptions = {
        mode: "javascript",
        lineNumbers: true,
        matchBrackets: true,
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
        keyMap: editorFactory.keyMap || "sublime",
        theme: editorFactory.theme || "mbo"
    };

    $scope.snakeCode = {content: editorFactory.currentSnakeContent};

    editorFactory.loadEditorSettings()
    .then(function () {
        if (editorFactory.theme) {
            $scope.editorOptions.theme = editorFactory.theme;
            $scope.editorOptions.keyMap = editorFactory.keyMap;
        }
    });

    $scope.settingsHidden = true;
    $scope.showEditorSettings = function () {
        $scope.settingsHidden = false;
    };
    $scope.saveEditorSettings = function () {
        editorFactory.saveEditorSettings($scope.editorOptions);
    };
    $scope.hideEditorSettings = function () {
        editorFactory.saveEditorSettings($scope.editorOptions);
        $scope.settingsHidden = true;
    };
    $scope.testSnake = function (code) {
        editorFactory.currentSnakeContent = code;
        editorFactory.saveEditorSettings($scope.editorOptions);
        $location.url("/arena?test-snake=true");
    };
    $scope.saveSnake = function (snake) {
        console.log(snake);
        if (!userFactory.me) {
            $scope.error = "Not Logged In";
            return;
        }

        snake.userId = userFactory.me._id;

        return;
        snakeFactory.save(snake, function (err, newSnake) {
            if (err) {
                $scope.error = err;
                return;
            }
            console.log("Saved:", newSnake);
        });
    };
    $scope.colorThemes = ["3024-day", "3024-night", "abcdef", "ambiance-mobile", "ambiance", "base16-dark", "base16-light", "bespin", "blackboard", "cobalt", "colorforth", "dracula", "eclipse", "elegant", "erlang-dark", "hopscotch", "icecoder", "isotope", "lesser-dark", "liquibyte", "material", "mbo", "mdn-like", "midnight", "monokai", "neat", "neo", "night", "panda-syntax", "paraiso-dark", "paraiso-light", "pastel-on-dark", "railscasts", "rubyblue", "seti", "solarized", "the-matrix", "tomorrow-night-bright", "tomorrow-night-eighties", "ttcn", "twilight", "vibrant-ink", "xq-dark", "xq-light", "yeti", "zenburn"];
});

snakeAppModule.controller("landingController", function (userFactory, $scope, $window) {
    $scope.$parent.setCurrentTab("");

    $scope.error = null;
    $scope.signedInUser = userFactory.me;
    console.log($scope.signedInUser);
    if (!$scope.signedInUser) {
        userFactory.whoAmI(function (me) {
            $scope.signedInUser = me;
        });
    } 

    $scope.login = function (user) {
        userFactory.login(user, function (err, loggedInUser) {
            if (err) {
                $scope.error = err;
            } else {
                $scope.signedInUser = loggedInUser;
                console.log("SIGNED IN:", $scope.signedInUser);
            }
        });
    };
    $scope.register = function (user) {
        console.log(user);
        userFactory.register(user, function (err, loggedInUser) {
            if (err) {
                $scope.error = err;
            } else {
                console.log("LOGGED IN", loggedInUser);
            }
        });
    };
    $scope.signOut = function () {
        userFactory.signOut(function (err) {
            if (err) {
                console.log(err);
            } else {
                $scope.signedInUser = null;
                $window.location.href = "/";
            }
        });
    }
});
snakeAppModule.controller("snakesController", function ($scope) {
    $scope.$parent.setCurrentTab("snakes");
});
snakeAppModule.controller("docsController", function ($scope) {
    $scope.$parent.setCurrentTab("docs");
});

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
            return res;
        } catch (error) {
            console.log("ERROR IN CODE", error);
            return "?";
        }

    };
}