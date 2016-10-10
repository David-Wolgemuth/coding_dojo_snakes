
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = (function Sessions ()
{
    var controller = {};
    controller.login = function (req, res)
    {
        console.log("HERE");
        User.findOne({ $or: [
            { email: req.body.name },
            { username: req.body.name }]
        }, function (err, user) {
            if (err) {
                res.status(500).json({ message: err });
            } else if (!user) {
                res.status(400).json({ message: "User Not Found" });
            } else {
                user.verifyPassword(req.body.password, function (err, valid) {
                    if (err) {
                        res.status(500).json({ message: err });
                    } else if (!valid) {
                        res.status(400).json({ message: "Incorrect Password" });
                    } else {
                        req.session.userId = user._id;
                        res.json({ 
                            message: "Successfully Logged In",
                            user: user.public()
                        });
                    }
                });
            }
        });
    };
    controller.logout = function (req, res)
    {
        req.session.destroy();
        res.json({ message: "Successfully Logged Out" });
    };
    controller.me = function (req, res)
    {
        if (!req.session.userId) {
            return res.json({
                message: "Not Logged In",
                user: null
            });
        }
        User.findOne({ _id: req.session.userId }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            }
            res.json({
                message: "Logged In User",
                user: user.public(),
            })
        });
    };
    controller.loadEditorSettings = function (req, res)
    {
        res.json({
            message: "Editor Settings", 
            settings: req.session.editorSettings
        });
    };
    controller.saveEditorSettings = function (req, res)
    {
        req.session.editorSettings = req.body;
        res.status(200).json({ message: "Saved Editor Settings"});
    };

    return controller;
})();
