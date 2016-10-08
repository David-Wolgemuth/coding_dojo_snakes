
// Connect to Mongo Database
var mongoose = require("mongoose");
var uri = process.env.MONGO_URI || "mongodb://localhost/snakes-game";
mongoose.connect(uri);

// Require All Files In Models Directory
var fs = require("fs");
var models_path = __dirname + "/../models";
fs.readdirSync(models_path).forEach(function (file) {
    if (file.indexOf(".js") > 0) {
        require(models_path + "/" + file);
    }
});

// Return Connection (Use for Session Store)
module.exports = (function () {
        return mongoose.connection;
    }
)();
