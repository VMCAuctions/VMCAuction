
var express = require("express");
var app = express();
var session = require('express-session')

// var mongoose = require('mongoose')
// var Package = require('./models/package.js')



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
  //   ]
}

io.sockets.on('connection', function(socket){

  console.log('We are using sockets')
  console.log("sodket id:"  + socket.id)

  // ALL CHAT LOGIC
    socket.on("msg_sent", function(data) {

      if(allBidsBigObj[data.packId] == undefined){
        allBidsBigObj[data.packId] = [];
      }

      allBidsBigObj[data.packId].push({
        userId: data.userName,
        bid: data.bid,
        name: data.userName
      })

      // Package.findById(data.packId).exec(
      //   function(err, data){
      //     if(err){
      //       console.log("error occured " + err);
      //     } else {
      //       if(data!=null) {
      //         data.amount = Number(data.bid);
      //         data.save(function(err){
      //           if(err){
      //             console.log("error when saving: " + err);
      //           } else{
      //             console.log("successfully ");
      //           }
      //         })
      //       }
      //     }
      //   }
      // )

      console.log(
        "bid placed: " +
        data.bid
      )



      // PREVIOUS VERSION FROM CHAT LOGIC
      io.emit("update_chat", {
        lastBid: data.bid,
        userBidLast: data.userName
      } )

    })

    socket.on("page_refresh", function(data) {
      io.emit("update_chat", {
        lastBid:"empty",
        userBidLast: "nobody"
      })
    })

    socket.on("disconnect", () => console.log("Client disconnected"));
  // ALL CHAT LOGIC


})
