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
//mongoose.connect(keys.mongoURI);
mongoose.connect(keys.mongoURI, function(err) {
    if (err) {
      console.log(keys.mongoURI, err)
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

users = new Set()
io.on('connection', function(socket) {

  console.log('A user connected');
  socket.on('userInfo', function(data) {
    console.log('user Info: ', data.data);
    users.add(data.data)
  });

  //Send a message when 


  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });

});

const PORT = process.env.PORT || 5000; // Heroku sets this, in development use 5000
http.listen(PORT, '0.0.0.0'); //IP is either 0.0.0.0 or localhost 


