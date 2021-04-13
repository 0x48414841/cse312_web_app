const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require('body-parser');
const keys = require("./config/keys");



// Express App listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

 
io.on('connection', (client) => {

  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
  
});


io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
  console.log('new client connected');
  socket.emit('connection', null);
  socket.on('channel-join', id => {
      console.log('channel join', id);
      STATIC_CHANNELS.forEach(c => {
          if (c.id === id) {
              if (c.sockets.indexOf(socket.id) == (-1)) {
                  c.sockets.push(socket.id);
                  c.participants++;
                  io.emit('channel', c);
              }
          } else {
              let index = c.sockets.indexOf(socket.id);
              if (index != (-1)) {
                  c.sockets.splice(index, 1);
                  c.participants--;
                  io.emit('channel', c);
              }
          }
      });

      return id;
  });
  socket.on('send-message', message => {
      io.emit('message', message);
  });

  socket.on('disconnect', () => {
      STATIC_CHANNELS.forEach(c => {
          let index = c.sockets.indexOf(socket.id);
          if (index != (-1)) {
              c.sockets.splice(index, 1);
              c.participants--;
              io.emit('channel', c);
          }
      });
  });

});



/**
* @description This methos retirves the static channels
*/
app.get('/getChannels', (req, res) => {
  res.json({
      channels: STATIC_CHANNELS
  })
});

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
require("./utils/passport");

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



const PORT = process.env.PORT || 5000; // Heroku sets this, in development use 5000
app.listen(PORT, '0.0.0.0'); //IP is either 0.0.0.0 or localhost 


