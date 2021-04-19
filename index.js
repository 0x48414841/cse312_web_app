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


var SOCKET_LIST = {};

var Entity = function(){
    var self = {
        x:250,
        y:250,
        spdX:0,
        spdY:0,
        id:"",
    }
    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){
        self.x += self.spdX;
        self.y += self.spdY;
    }
    self.getDistance = function(pt){
        return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    }
    return self;
}

var Player = function(id){
    var self = Entity();
    self.id = id;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 10;
    self.health = 100;

    var super_update = self.update;
    self.update = function(){
        self.updateSpd();
        super_update();

        if(self.pressingAttack){
            self.shootBullet(self.mouseAngle);
        }
    }
    self.shootBullet = function(angle){
        var b = Bullet(self.id,angle);
        b.x = self.x;
        b.y = self.y;
    }


    self.updateSpd = function(){
        if(self.pressingRight)
            self.spdX = self.maxSpd;
        else if(self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if(self.pressingUp)
            self.spdY = -self.maxSpd;
        else if(self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }
    Player.list[id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function(socket){
    var player = Player(socket.id);
    socket.on('keyPress',function(data){
        if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
        else if(data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if(data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });
}
Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
}
Player.update = function(){
    var pack = [];
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        pack.push({
            x:player.x,
            y:player.y,
            number:player.number
        });
    }
    return pack;
}


var Bullet = function(parent,angle){
    var self = Entity();
    self.id = Math.random();
    self.spdX = Math.cos(angle/180*Math.PI) * 10;
    self.spdY = Math.sin(angle/180*Math.PI) * 10;
    self.parent = parent;
    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function(){
        if(self.timer++ > 100)
            self.toRemove = true;
        super_update();

        for(var i in Player.list){
            var p = Player.list[i];
            if(self.getDistance(p) < 20 && self.parent !== p.id){
                p.health -= 1;
                self.toRemove = true;
            }
        }
    }
    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};

Bullet.update = function(){
    var pack = [];
    for(var i in Bullet.list){
        var bullet = Bullet.list[i];
        bullet.update();
        if(bullet.toRemove)
            delete Bullet.list[i];
        else
            pack.push({
                x:bullet.x,
                y:bullet.y,
            });
    }
    return pack;
}

var DEBUG = true;

io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
    socket.on('sendMsgToServer',function(data){
        var playerName = ("" + socket.id).slice(2,7);
        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
        }
    });

    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);
    });



});

setInterval(function(){
    var pack = {
        player:Player.update(),
        bullet:Bullet.update(),
    }

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions',pack);
    }
},1000/25);

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
