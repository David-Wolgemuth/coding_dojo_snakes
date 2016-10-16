module.exports = ["$http",
function SnakeFactory ($http) {
    var defaultContent = 'if (utils.rand() > 0.1) {\n    return "s";\n} else {\n    var left = snake.getLeftTile();\n    utils.print("GOING LEFT!");\n    return left.cdir;\n}';

    var factory = {
        current: null,
        snakes: []
    };


    factory.index = function (callback, force)
    {
        if (!force && factory.snakes.length > 0) {
            if (typeof callback === "function") {
                callback(factory.snakes);
            }
            return;
        }
        $http({
            method: "GET",
            url: "snakes?q=with-users"
        }).then(function (res) {
            factory.snakes = res.data.snakes;
            if (typeof callback === "function") {
                callback(factory.snakes);
            }
        });
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
            
        });
    };
    factory.reset = function (hard) {
        if (hard) {
            delete factory.current._id;
        }
        factory.current.content = defaultContent;
        factory.current.color = null;
        factory.current.name = null;
        return factory.current;
    };
    factory.star = function (snake, callback) {
        $http({
            method: "POST",
            url: "/snakes/star",
            data: { snakeId: snake._id }
        }).then(function (res) {
            snake.stars = res.data.stars;
            // callback?
        });
    };
    factory.save = function (snake, callback) {
        $http({
            method: "POST",
            url: "/snakes",
            data: snake
        }).then(function (res) {
            factory.snakes.push(res.data.snake);
            console.log("Saved Snake:", res.data.snake);
        }).catch(function (res) {
            console.log("ERROR:", res.data.message);
        });
    };
    factory.update = function (snake, callback) {
        console.log("UPDATING:", snake);
        if (typeof snake._user === "object") {
            var copy = {};
            for (var key in snake) {
                copy[key] = snake[key];
            }
            copy._user = snake._user._id;
            snake = copy;
        }
        $http({
            method: "PUT",
            url: `/snakes/${snake._id}`,
            data: snake
        }).then(function (res) {
            if (typeof callback === "function") {
                callback(true);
            }
        });
    };
    factory.delete = function (snake, callback)
    {
        $http({
            method: "DELETE",
            url: `/snakes/${snake._id}`
        }).then(function () {
            var idx = factory.snakes.indexOf(snake);
            factory.snakes.splice(idx, 1);
            if (typeof callback === "function") {
                callback();
            }
        });
    };
    return factory;
}];