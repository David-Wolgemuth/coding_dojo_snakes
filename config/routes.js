
var Users = require("../controllers/users.js");
var Snakes = require("../controllers/snakes.js");
var Sessions = require("../controllers/sessions.js");

module.exports = function (router) 
{
    router

    .get("/me", Sessions.me)
    .get("/editorSettings", Sessions.loadEditorSettings)
    .post("/editorSettings", Sessions.saveEditorSettings)
    .post("/login", Sessions.login)
    .get("/logout", Sessions.logout)
    .post("/users", Users.create)
    .get("/snakes", Snakes.index)
    .post("/snakes", Snakes.create)
    .post("/snakes/star", Snakes.star)
    .put("/snakes/:id", Snakes.update)
    .delete("/snakes/:id", Snakes.delete);
};
