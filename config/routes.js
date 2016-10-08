
var Users = require("../controllers/users.js");

module.exports = function (router) 
{
    router
    .param("id", function (req, res, next, id) {
        // req.body.id = id  //  Middleware to move id from param to body
        next();
    })

    // .get("/users", Users.index)
    // .get("/users/new", Users.new)
    // .get("/users/:id", Users.show)
    // .post("/users", Users.create)
    // .get("/users/edit/:id", Users.edit)
    // .put("/users/:id", Users.update)
    // .delete("/users/:id", Users.delete);
};
