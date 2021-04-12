const mongoose = require("mongoose");
const { Schema } = mongoose; // const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  loggedIn: { type: Boolean, default: false },
  profilePic: { type: String, default: "" },
  email: String
});

// Creates the collection called users in the DB
mongoose.model("users", userSchema);
