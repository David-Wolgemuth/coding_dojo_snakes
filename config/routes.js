
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
    // .get("/users", Users.index)
    // .get("/users/new", Users.new)
    // .get("/users/:id", Users.show)
    .post("/users", Users.create)
    .get("/snakes", Snakes.index)
    .post("/snakes", Snakes.create)
    .put("/snakes/:id", Snakes.update)
    // .get("/users/edit/:id", Users.edit)
    // .put("/users/:id", Users.update)
    // .delete("/users/:id", Users.delete);
};
