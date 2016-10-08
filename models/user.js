var mongoose = require("mongoose");
var validate = require("mongoose-validate");
var bcrypt = require("mongoose-bcrypt");

var UserSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: false,
        validate: [validate.email, "Invalid Email Address"]
    },
    // password: bcrypt
    snakes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Snake"
    }],
    starred: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Snake"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
});

// Add Secure Passwords
UserSchema.plugin(bcrypt);

mongoose.model("User", UserSchema);