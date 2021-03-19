const passport = require("passport");
const multer  = require('multer');
const path = require('path');

module.exports = (app) => {
  app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname + '/homepage.html'));
  });

  app.get("/game.js", (req, res) => {
    res.sendFile(path.join(__dirname + '/game.js'));
  });

  //returns all logged-in users by performing a query to the database
  app.get("/current_users", (req, res) => {
      var MongoClient = require('mongodb').MongoClient;
      users = []
      MongoClient.connect('mongodb://localhost:27017/db', function(err, db) {
        if (err) throw err;
        var dbo = db.db("db");
        var query ={loggedIn: true};
        dbo.collection("users").find(query).toArray(function(err, result) { // not correct; will fix later
          if (err) throw err; 
          db.close();
          console.log("all logged in users", result);
          res.send(result)
        });
    });
   });

  /*
  app.get("/home/js", (req, res) => {
   // console.log("here ");
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('content-type', 'text/js');
    //if (req.isAuthenticated()){res.send("logged in")};
    res.send(`function uploadPic() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
              }
            };
            xhttp.open("GET", "/api/current_user", true);
            xhttp.setRequestHeader('Access-Control-Allow-Origin', '*')
          
            xhttp.send();
          }
              `); //  res.send(req.session)
  });
  */
  app.get("/home/file", (req, res) => {
      // 'profile_pic' is the name of our file input field in the HTML form
      let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');
  
      upload(req, res, function(err) {
          // req.file contains information of uploaded file
          // req.body contains information of text fields, if there were any
  
          if (req.fileValidationError) {
              return res.send(req.fileValidationError);
          }
          else if (!req.file) {
              return res.send('Please select an image to upload');
          }
          else if (err instanceof multer.MulterError) {
              return res.send(err);
          }
          else if (err) {
              return res.send(err);
          }
  
          // Display uploaded image for user validation
          res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
      });

  });
};


