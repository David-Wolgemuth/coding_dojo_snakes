module.exports = ["snakeFactory", "userFactory", "$scope", "$location",
function EditorController (Snake, User, $scope, $location) {
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
        console.log($scope.snake);
    });

    Snake.loadEditorSettings()
    .then(function () {
        if (Snake.theme) {
            $scope.editorOptions.theme = Snake.theme;
            $scope.editorOptions.keyMap = Snake.keyMap;
        }
    });

    $scope.settingsHidden = true;
    $scope.showEditorSettings = function () {
        $scope.settingsHidden = false;
    };
    $scope.saveEditorSettings = function () {
        Snake.saveEditorSettings($scope.editorOptions);
    };
    $scope.hideEditorSettings = function () {
        Snake.saveEditorSettings($scope.editorOptions);
        $scope.settingsHidden = true;
    };
    $scope.testSnake = function (code) {
        Snake.currentSnakeContent = code;
        Snake.saveEditorSettings($scope.editorOptions);
        $location.url("/arena?test-snake=true");
    };
    $scope.saveSnake = function (snake) {
        console.log(snake);
        if (!User.me) {
            console.log("NOT LOGGED IN");
            $scope.error = "Not Logged In";
            return;
        }

        if (snake._id) {
            console.log("UPDATING");
            Snake.update(snake, function () {

            });
            return;
        }

        snake.userId = User.me._id;
        Snake.save(snake, function (err, newSnake) {
            if (err) {
                $scope.error = err;
                return;
            }
            console.log("Saved:", newSnake);
        });
    };
    $scope.colorThemes = ["3024-day", "3024-night", "abcdef", "ambiance-mobile", "ambiance", "base16-dark", "base16-light", "bespin", "blackboard", "cobalt", "colorforth", "dracula", "eclipse", "elegant", "erlang-dark", "hopscotch", "icecoder", "isotope", "lesser-dark", "liquibyte", "material", "mbo", "mdn-like", "midnight", "monokai", "neat", "neo", "night", "panda-syntax", "paraiso-dark", "paraiso-light", "pastel-on-dark", "railscasts", "rubyblue", "seti", "solarized", "the-matrix", "tomorrow-night-bright", "tomorrow-night-eighties", "ttcn", "twilight", "vibrant-ink", "xq-dark", "xq-light", "yeti", "zenburn"];
}];