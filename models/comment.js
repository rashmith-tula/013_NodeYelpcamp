var mongoose = require("mongoose");

var cmntSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String
});

module.exports = mongoose.model("Comment", cmntSchema);
