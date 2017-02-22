module.exports = ["snakeFactory", "userFactory", "arenaFactory", "$scope", "$location", "$timeout",
function EditorController (Snake, User, Arena, $scope, $location, $timeout) {

    User.whoAmI(function (me) {
        if (!me) {
            $location.url("/login");
        }
    });

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
        keyMap: Snake.keyMap || "sublime",
        theme: Snake.theme || "mbo"
    };

    Snake.getLastEdited(function () {
        $scope.snake = Snake.current;
    });

    Snake.loadEditorSettings()
    .then(function () {
        if (Snake.theme) {
            $scope.editorOptions.theme = Snake.theme;
            $scope.editorOptions.keyMap = Snake.keyMap;
        }
    });

    $scope.settingsHidden = true;
    $scope.showEditorSettings = function ()
    {
        $scope.settingsHidden = false;
    };
    $scope.saveEditorSettings = function ()
    {
        Snake.saveEditorSettings($scope.editorOptions);
    };
    $scope.hideEditorSettings = function ()
    {
        Snake.saveEditorSettings($scope.editorOptions);
        $scope.settingsHidden = true;
    };
    $scope.testSnake = function ()
    {
        $scope.snake.color = extractColor($scope.snake.color);
        if (!$scope.snake.color) {
            return $scope.error = "Color Required";
        }
        Snake.saveEditorSettings($scope.editorOptions);
        Arena.makeNewTest($scope.snake);
        $location.url("/arena");
    };
    $scope.saveSnake = function (snake, saveAsNew)
    {
        if (!User.me) {
            return $scope.error = "Not Logged In";
        }
        if (!snake.name) {
            return $scope.error = "Please Name Your Snake!";
        }

        if (saveAsNew) {
            // Copy All Values, Remove Id
            var copy = {};
            for (var key in snake) {
                copy[key] = snake[key];
            }
            delete copy._id;
            delete copy.createdAt;
            delete copy.updatedAt;
            snake = copy;
        }

        if (snake._id) {
            Snake.update(snake, function () {
                $scope.error = "";
                $scope.message = "Successfully Saved Snake!";
                $timeout(() => $scope.message = "", 2000);
            });
            return;
        }

        snake.userId = User.me._id;
        snake.color = extractColor(snake.color);
        if (!snake.color) {
            return $scope.error = "Color Required";
        }

        Snake.save(snake, function (err, newSnake) {
            $scope.snake = newSnake;
            if (err) {
                $scope.error = err;
                return;
            }
            $scope.error = "";
            $scope.message = "Created New Snake!";
            $timeout(() => $scope.message = "", 2000);
        });
    };
    $scope.reset = function (hard)
    {
        $scope.error = "";
        $scope.message = "Blank Slate!";
        $timeout(() => $scope.message = "", 2000);
        $scope.snake = Snake.reset(hard);
    };
    $scope.colorThemes = ["3024-day", "3024-night", "abcdef", "ambiance-mobile", "ambiance", "base16-dark", "base16-light", "bespin", "blackboard", "cobalt", "colorforth", "dracula", "eclipse", "elegant", "erlang-dark", "hopscotch", "icecoder", "isotope", "lesser-dark", "liquibyte", "material", "mbo", "mdn-like", "midnight", "monokai", "neat", "neo", "night", "panda-syntax", "paraiso-dark", "paraiso-light", "pastel-on-dark", "railscasts", "rubyblue", "seti", "solarized", "the-matrix", "tomorrow-night-bright", "tomorrow-night-eighties", "ttcn", "twilight", "vibrant-ink", "xq-dark", "xq-light", "yeti", "zenburn"];
    function extractColor (color)
    {
        console.log(color);
        var found = /(#[0-9a-f]{6})/.exec(color.toLowerCase());
        console.log(found);
        if (found) {
            return found[0];
        }
        return null;
    }
}];