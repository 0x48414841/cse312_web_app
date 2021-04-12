//returns all logged-in users by performing a query to the database

module.exports = (app) => {

app.get("/current_users", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  users = [];
  MongoClient.connect("mongodb://localhost:27017/db", function (err, db) {
    if (err) throw err;
    var dbo = db.db("db");
    var query = { loggedIn: true };
    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        // not correct; will fix later
        if (err) throw err;
        db.close();
        console.log("all logged in users", result);
        res.send(result);
      });
  });
});
}