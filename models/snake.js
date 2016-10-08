var mongoose = require("mongoose");

var SnakeSchema = new mongoose.Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    color: {
        type: String,
    },
    content: {
        type: String,
        maxlength: 4000
    },
    private: {
        type: Boolean,
        default: false
    },
    stars: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
    }
}, {
    timestamps: true
});

mongoose.model("Snake", SnakeSchema);