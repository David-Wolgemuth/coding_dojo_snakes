
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Snake = mongoose.model("Snake");

module.exports = (function Snakes ()
{
    var controller = {};
    controller.index = function (req, res)
    {
        var filter = {};
        var options = {};
        switch (req.query.q) {
            case "last-edited":
                filter._user = req.session.userId
                options.sort = { updatedAt: -1 };
                options.limit = 1;
            case "with-users":
                options.populate = "_user";
        }
        console.log("\nFILTER", filter);
        Snake.find(filter).sort(options.sort).limit(options.limit).populate(options.populate)
        .exec(function (err, snakes) {
            if (err) {
                console.log("snakes.index:", err);
                return res.status(500).json({ message: err });
            }
            console.log("SNAKES", snakes);
            if (options.limit === 1) {
                res.json({ message: "Results", snake: snakes[0] });
            } else {
                res.json({ message: "Results", snakes: snakes });
            }
        });
    };
    controller.create = function (req, res)
    {
        if (!req.session.userId) {
            return res.status(400).json({
                message: "User Not Logged In"
            });
        }
        var snake = new Snake({
            _user: req.session.userId,
            name: req.body.name,
            color: req.body.color,
            content: req.body.content,
            private: req.body.private
        });
        snake.save(function (err) {
            if (err) {
                console.log("snakes.create:", err);
                res.status(400).json({
                    message: err
                });
            } else {
                res.json({
                    message: "Successfully Created Snake",
                    snake: snake
                });
            }
        });
    };
    controller.star = function (req, res)
    {
        console.log(req.body);
        Snake.findOne({ _id: req.body.snakeId }, function (err, snake) {
            if (err) {
                console.log("snakes.star", err);
                return res.status(500).json({ message: err });
            }
            if (!snake) {
                console.log("snakes.star NOT FOUND");
                return res.status(404).json({ message: "Snake Not Found" });
            }
            var idx = snake.stars.indexOf(req.session.userId);
            var message;
            if (idx < 0) {
                snake.stars.push(req.session.userId);
                message = "Starred Snake";
            } else {
                snake.stars.splice(idx, 1);
                message = "Unstarred Snake";
            }
            snake.save(function (err) {
                if (err) {
                    console.log("snakes.star", err);
                    return res.status(500).json({ message: err });
                }
                res.json({ message: message, stars: snake.stars });
            });
        });
    };
    controller.update = function (req, res)
    {
        if (req.session.userId !== req.body._user) {
            return res.status(400).json({
                message: "Incorrect User"
            });
        }
        Snake.findOne({ _id: req.params.id }, function (err, snake) {
            snake.name = req.body.name;
            snake.color = req.body.color;
            snake.content = req.body.content;
            snake.private = req.body.private;
            snake.save(function (err) {
                if (err) {
                    console.log("snakes.update", err);
                    return res.status(400).json({
                        message: err
                    });
                }
                res.json({
                    message: "Successfully Saved Snake",
                    snake: snake
                });
            });
        });
    };
    controller.delete = function (req, res)
    {
        Snake.remove({ _id: req.params.id }, function (err, snake) {
            if (err) {
                return res.status(500).json({ message: err });
            }
            return res.json({ message: "Successfully Deleted" });
        });
    }
    return controller
})();