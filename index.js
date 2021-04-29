const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require('body-parser');
const keys = require("./config/keys");


// Express App listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
console.log("The IP address is", process.env.IP, keys.ip, "\nMONGO IP is", process.env.MONGO_URI, keys.mongoURI)
//------------------Handle cookies; -----------------------------------------------------------
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey] // Used to encrypt cookie - don't commit to git
  })
);

app.use(passport.initialize())
app.use(passport.session()); // Tells passport to use cookies


//----------------- Mongoose config --------------------------------------------------------------------
const mongoose = require("mongoose");
const { mongoURI } = require("./config/prod");
var MongoClient = require('mongodb').MongoClient;
//mongoose.connect(keys.mongoURI);
mongoose.connect(keys.mongoURI, function(err) {
    if (err) {
      console.log("error, line 35")
      throw err;
    }
});


// Will automatically get executed
require("./models/User"); // Must be imported first, before passport
require("./services/passport");

// -------------------Routes ---------------------------------------------------------------------------
// --------------Dont do it this way -------------------
// const authRoutes = require("./routes/authRoutes");
// authRoutes(app);
require("./routes/authRoutes")(app);
require("./routes/ex")(app);

// --------- always return index.html --------------------------------
if (process.env.NODE_ENV === 'production') {

  // order matters here, first check client/build to match exact asset, then default to index.html file
  app.use(express.static('client/build'));

  //Serve up the index.html file if it doesn't recognize the route
  const path = require('path');

  // For all URLS return index.html because react router handles which page is showed
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

clients={};
userIDs = {};
 
io.on('connection',  function(socket) {
  //clients.push(socket.rooms)
  //console.log('all users', clients );
  console.log('**LOGIN** A user connected',socket.id  );
  socket.on('userInfo', function(data) {
    googleId =  data.data
    if (googleId in userIDs === false) {
      userIDs[googleId] = 1
    } else {
      userIDs[googleId] ++
    }
    console.log("googleId = ", googleId)
    clients[socket.id] = googleId
    MongoClient.connect('mongodb://localhost:27017/db', function(err, db) {
        if (err) throw err;
        var dbo = db.db("db");
        var myquery = { googleId: googleId};
        var newvalues = { $set: {loggedIn: true} };
        dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
        });
    });

  socket.on('disconnect', function() {
    console.log("**LOGGED OUT ** user ", clients[socket.id], 'has logged out');
    googleId = clients[socket.id]
    userIDs[googleId]--;
    if (userIDs[googleId] <= 0) {
      delete userIDs[googleId]

      MongoClient.connect('mongodb://localhost:27017/db', function(err, db) {
          if (err) throw err;
          var dbo = db.db("db");
          var myquery = { googleId: googleId };
          var newvalues = { $set: {loggedIn: false} };
          dbo.collection("users").updateOne(myquery, newvalues, function(err, res) { 
            if (err) throw err; 
            db.close();
          });
         console.log('A user disconnected');
      });
    }

    delete clients[socket.id]
});


   // console.log('user Info: ', data.data);
   // users.add(data.data)
  });

  //Send a message when 


});

const PORT = process.env.PORT || 5000; // Heroku sets this, in development use 5000
http.listen(PORT, '0.0.0.0'); //IP is either 0.0.0.0 or localhost 


