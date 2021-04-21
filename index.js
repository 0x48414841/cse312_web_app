const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require('body-parser');
const keys = require("./config/keys");
const cors = require('cors');



// Express App listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

app.use(cors());
 

io.on('connect', (socket) => {

  socket.on('join', ({ name, room }, callback) => {

    // console.log(name,room);
    // console.log("adsdsasadsdasdasadsdasda");
    // console.log("adsdsasadsdasdasadsdasda");
    // console.log("adsdsasadsdasdasadsdasda");
    // console.log("adsdsasadsdasdasadsdasda");
    // console.log("adsdsasadsdasdasadsdasda");
    // console.log("adsdsasadsdasdasadsdasda");
    // console.log("adsdsasadsdasdasadsdasda");

    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    // Let thgis socket subscribe to given room
    socket.join(user.room);


    // Tell the user they have joined
    // socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});

    // Return all existing users in the room
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();

  });

  socket.on('sendMessage', (message, callback) => {
    var {message, room} = message
    const user = getUser(socket.id, room);
    console.log(user);

    console.log(message, room);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
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
http.listen(PORT, '0.0.0.0'); //IP is either 0.0.0.0 or localhost 



// ROOM CONCEPT - https://socket.io/docs/v3/rooms/

// You can call join to subscribe the socket to a given channel:

// io.on('connection', socket => {
//   socket.join('some room');
// });
// And then simply use to or in (they are the same) when broadcasting or emitting:

// io.to('some room').emit('some event');
// You can emit to several rooms at the same time:

// io.to('room1').to('room2').to('room3').emit('some event');
