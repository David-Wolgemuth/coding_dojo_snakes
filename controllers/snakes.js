
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Snake = mongoose.model("Snake");

module.exports = (function Snakes ()
{
    var controller = {};
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
        if (req.session.userId !== req.body.userId) {
            res.status(400).json({
                message: "Incorrect User"
            });
        }
        Snake.findOne({ _id: req.status.snakeId }, function (err, snake) {
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