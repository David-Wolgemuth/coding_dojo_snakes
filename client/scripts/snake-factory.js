module.exports = ["$http",
function SnakeFactory ($http) {
    var defaultContent = 'if (utils.rand() > 0.1) {\n    return "s";\n} else {\n    var left = snake.getLeftTile();\n    utils.print("GOING LEFT!");\n    return left.cdir;\n}';

    var factory = {
        current: null
    };

    factory.getLastEdited = function (callback)
    {
        if (factory.current) {
            if (typeof callback === "function") {
                callback(factory.current);
            }
            return;
        }
        $http({
            method: "GET",
            url: "snakes?q=last-edited"
        }).then(function (res) {
            console.log(res);
            if (res.data.snake) {
                factory.current = res.data.snake;
            } else {
                factory.current = {
                    content: defaultContent
                };
            }
            if (typeof callback === "function") {
                callback(factory.current);
            }
        });
    };
    factory.getLastEdited();
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
    factory.save = function (snake, callback) {
        $http({
            method: "POST",
            url: "/snakes",
            data: snake
        }).then(function (res) {
            console.log("Saved Snake:", res.data.snake);
        }).catch(function (res) {
            console.log("ERROR:", res.data.message);
        });
    };
    factory.update = function (snake, callback) {
        console.log("UPDATING:", snake);
        $http({
            method: "PUT",
            url: `/snakes/${snake._id}`,
            data: snake
        }).then(function (res) {
            if (typeof callback === "function") {
                callback(true);
            }
        })
    }
    return factory;
}];