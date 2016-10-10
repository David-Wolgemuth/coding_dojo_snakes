var mongoose = require("mongoose");
var validate = require("mongoose-validate");
var bcrypt = require("mongoose-bcrypt");

var UserSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: false,
        index: { unique: true },
        validate: [validate.email, "Invalid Email Address"]
    },
    username: {
        type: String,
        required: true,
        index: { unique: true }
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
UserSchema.methods.public = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.email;
    return obj;
};

mongoose.model("User", UserSchema);