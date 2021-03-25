const mongoose = require("mongoose");
const { Schema } = mongoose; // const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 }, //example of an attribute you can add
  loggedIn: Boolean,
  profilePic: String,
});

// Creates the collection called users in the DB
mongoose.model("users", userSchema);
