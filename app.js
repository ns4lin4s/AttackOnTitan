var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    request = require('request'),
    wait = require('wait.for'),
    passport = require('./config/passport'),
    mongoose = require('mongoose')

var port = process.env.APP_PORT

var app = express()
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//Routes
var index = require('./routes/index')
var users = require('./routes/users')

//http://expressjs.com/es/advanced/best-practice-security.html
app.use(helmet())
app.disable('x-powered-by')
app.use(session({
  secret: 'ccc-7a6n42c*i5?0_api',
  resave: true,
  saveUninitialized: true
}))

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false,limit: '1GB' }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// connect to mongodb database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todoDemo');
passport(app);

passport(app);

//Routes
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.START_TYPE === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

process.env.UV_THREADPOOL_SIZE = 128

server.listen(port, function () {
  console.log(`Listening on ${server.address().port}`);
});
// app.listen(port, () => {

//   console.log(`${new Date().toLocaleString()} | AttackOnTitan | EXPRESS (${process.env.START_TYPE}) PORT: ${port}`);

//   if (process.env.START_TYPE == "development") {
//     //Setear valores si es dev
//   }
//   app.set('config',{
//     nombre: "AttackOnTitanApp"
//     //Si falta algo, se agrega aca, es como un loader para variables que se necesiten desde el controller
//   })

// })
var players = {};

io.on('connection', function (socket) {
  console.log('a user connected');
  // create a new player and add it to our players object
  players[socket.id] = {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id
  };
  // // send the players object to the new player
  socket.emit('currentPlayers', players);
  // // send the star object to the new player
  // socket.emit('starLocation', star);
  // // send the current scores
  // socket.emit('scoreUpdate', scores);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);
  socket.on('disconnect', function () {
      console.log('user disconnected:' + socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
  });

  // // when a player moves, update the player data
  // socket.on('playerMovement', function (movementData) {
  //     players[socket.id].x = movementData.x;
  //     players[socket.id].y = movementData.y;
  //     players[socket.id].rotation = movementData.rotation;
  //     // emit a message to all players about the player that moved
  //     socket.broadcast.emit('playerMoved', players[socket.id]);
  // });

  // socket.on('starCollected', function () {
  //     if (players[socket.id].team === 'red') {
  //       scores.red += 10;
  //     } else {
  //       scores.blue += 10;
  //     }
  //     star.x = Math.floor(Math.random() * 700) + 50;
  //     star.y = Math.floor(Math.random() * 500) + 50;
  //     io.emit('starLocation', star);
  //     io.emit('scoreUpdate', scores);
  //   });
});

module.exports = app