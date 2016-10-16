
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
                console.log("\n\n\n", filter ,"\n\n\n\n");
        }
        Snake.find(filter).sort(options.sort).limit(options.limit).exec(function (err, snakes) {
            console.log(err, snakes);
            if (err) {
                return res.status(500).json({ message: err });
            }
            if (options.limit === 1) {
                res.json({ message: "Results", snake: snakes[0] });
            } else {
                res.json({ message: "Results", snakes: snakes });
            }
        });
    };
    controller.create = function (req, res)
    {
        console.log("\n\n\nHIT CREATE\n\n\n");
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
                    return res.status(400).json({
                        message: err
                    });
                }
                res.json({
                    message: "Successfully Saved Snake",
                    snake: snake
                })
            })
        });
    };
    return controller
})();