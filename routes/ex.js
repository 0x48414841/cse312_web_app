const passport = require("passport");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const multer  = require('multer')
const mime = require("mime")

module.exports = (app) => {


  app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));

  });

  app.get("/game.js", (req, res) => {
    res.sendFile(path.join(__dirname + '/game.js'));
  });



  app.use(fileUpload());

  //https://github.com/richardgirges/express-fileupload/tree/master/example
  app.post('/upload_picture', function(req, res) {
    // Uploaded files:
    console.log("made it here", req.user['googleId'])
    console.log(mime.getType(req.files.profile_pic.name));
    ext = mime.getType(req.files.profile_pic.name);
    console.log(ext, mime.getExtension(ext))
    if (ext === 'image/png' || ext === 'image/jpg' || ext === 'image/jpeg') {
      file = req.files.profile_pic;
      filePath = path.join(__dirname + '/../images/'+req.user['googleId'] + '.' + mime.getExtension(ext))
      file.mv(filePath, function(err) {
        if (err) { console.log(err); return res.status(500).send(err);}
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017/db', function(err, db) {
          if (err) throw err;
          var dbo = db.db("db");
          var myquery = { googleId: req.user['googleId']}; //might have to replace with googleId
          console.log('filePath: ', filePath)
          console.log('here', req.user['id']);
          var newvalues = { $set: {profilePic: filePath } };
          dbo.collection("users").updateOne(myquery, newvalues, function(err, res) { 
            if (err) console.log(err) ; 
            //console.log(res)
            db.close();
          });
       });
      });
    }
    res.redirect('/home')
  });


  app.get("/get_profile_pic", (req, res) => {
    var MongoClient = require('mongodb').MongoClient;
    id = req.user['googleId']
    console.log(id)
    MongoClient.connect('mongodb://localhost:27017/db', function(err, db) {
      if (err) throw err;
      var dbo = db.db("db");
      var query = {googleId: id};
      dbo.collection("users").findOne(query, function(err, result) {
        if (err) throw err; 
        db.close();
        // console.log(result)

        filePath = result.profilePic

        res.set({'X-Content-Type-Options' : 'nosniff'});
        res.sendFile(filePath);
      });
  });
 });

};


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
  });.
  */

  //https://github.com/expressjs/multer
  /*var upload = multer({ dest: '../images/', 
      fileFilter: function (req, file, callback) {
      var extension = path.extname(file.originalname).toLowerCase();
      if(extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg') {
        return callback(new Error('Not a valid image'))
      }
      callback(null, true)
    },
  })
  app.post('/upload_picture', upload.single('profile_pic'),  function (req, res) {
    //fileName = '/image/' + req.files.
    console.log("made it here", req.user['googleId'])
    res.redirect('/home')
  }); 
  */