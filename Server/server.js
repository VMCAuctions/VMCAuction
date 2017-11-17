
var express = require("express");
var app = express();
var session = require('express-session')




app.use(session({
  secret: 'Sd9JKlui26nbM52UQwer0pM15oPzXL',
  resave: false,
  saveUninitialized: true,
  rolling: true //resets session timeout everytime the user interacts with the site
}));

var React = require('../client/node_modules/react');
// var jsx = require('node-jsx');
// jsx.intall();

var bodyParser = require('body-parser');
app.use(bodyParser.json());


var path = require("path");


// static content
app.use(express.static(path.join(__dirname, "../client/public")));
// app.set('views', path.join(__dirname, '../client/frontend/public'));
// app.set('views', path.join(__dirname, './views'));


///////////////////////////////////////////////////////////////////////////////////
//////// THIS PORTION IS TEMPORARY - IT IS JUST HERE TO RUN THE HTML MOCKUPS OF THE
//////// UNINTEGRATED BIDDER SCREENS FOR OUR PRESENTATION TO THE CLIENT ON 7/28/17
app.set('views', path.join(__dirname, '../wireframe'));
app.set('view engine', 'ejs');
//////////////////////////////////////////////////////////////////////////////////

// require the mongoose configuration file which does the rest for us
//////  REMEMBER TO GO TO "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" /////////
require('./config/mongoose.js');

var routes_setter = require('./config/routes.js');
routes_setter(app);


// tell the express app to listen on port 8000
var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
 console.log("listening on port "+port);
})


// var io = require('socket.io').listen(server);
//
// io.sockets.on('connection', function(socket){
// 	console.log('using sockets');
// 	console.log(socket.id);
// 	//all the socket code goes in here!
// 	socket.on('posting_form', function(data){
// 		console.log(data.form);
// 		socket.emit('server_response', {response: 'back from the server',
// 			name: data.name}
// 		);
// 	});
// })

/////////////// SOCKETS /////////////////

var io = require('socket.io').listen(server);

// allBidsObject
var allBidsBigObj = {
  // package1: [
  //     {userId: "user4", bid: 150, name: "Yarik"},
  //     {userId: "user3", bid: 200 name: "Brendan"}
  //   ],
  // package2: [
  //     {userId: "user2", bid: 200, name: "Jonathan"},
  //     {userId: "user1", bid: 210, name: "Tali"}
  //   ]
}

io.sockets.on('connection', function(socket){



  // once a client has connected, we expect to get a ping from them saying what room they want to join
  // socket.on('room', function(room){
  //     if(socket.room)
  //         socket.leave(socket.room);
  //
  //     socket.room = room;
  //     socket.join(room);
  // });

  console.log('We are using sockets')
  console.log("sodket id:"  + socket.id)

  // ALL CHAT LOGIC

    socket.on("msg_sent", function(data) {

      // allBidsBigObj[data.packId].push({
      //   bid: data.bid,
      //   packId: data.pack_id,
      //   userId: data.userName
      // })
      console.log(
        "bid placed: " +
        data
      )

      // console.log(`into chatLog was added new line: ${users[data.userId].name}: ${data.msg}`);
      // now, it's easy to send a message to just the clients in a given room
      // var room = data.packId;
      // io.sockets.in(room).emit("update_chat", {
      //   chatLog: allBidsBigObj[data.packId][allBidsBigObj[data.packId].length-1],
      //   packId: data.packId
      // });

      // PREVIOUS VERSION FROM CHAT LOGIC
      io.emit("update_chat", data.bid )

    })

    socket.on("page_refresh", function(data) {
      io.emit("update_chat", "response blabla")
    })

    socket.on("disconnect", () => console.log("Client disconnected"));
  // ALL CHAT LOGIC


})
