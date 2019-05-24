var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({ username: String, password: String });

var psptmngs = require("passport-local-mongoose");

userSchema.plugin(psptmngs);

module.exports = mongoose.model("User", userSchema);
