
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = (function Users ()
{
    var controller = {};
    controller.create = function (req, res)
    {
        console.log(req.body);
        if (req.body.email === "") {
            // Empty String Messes With Validation
            delete req.body.email;
        }
        var user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        user.save(function (err) {
            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                req.session.userId = user._id;
                res.json({
                    message: "Successfully Created User",
                    user: user.public()
                });
            }
        });
    };
    return controller
})();