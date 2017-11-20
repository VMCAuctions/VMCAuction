
var express = require("express");
var app = express();
var session = require('express-session')

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;




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
var Package = require('./models/package.js')

var io = require('socket.io').listen(server);

// allBidsObject to store all bids in controller
var allBidsBigObj = {
  // package1: [
  //     {userId: "user4", bid: 150, name: "Yarik"},
  //     {userId: "user3", bid: 200 name: "Brendan"}
  //   ]
  // allBidsBigObj[packId][allBidsBigObj[packId].length-1].name
  // allBidsBigObj[packId][allBidsBigObj[packId].length-1].bid
}

io.sockets.on('connection', function(socket){

  console.log('We are using sockets')
  console.log("sodket id:"  + socket.id)

  console.log("/".repeat(20) + " allBidsBigObj before socket logic " + "/".repeat(20))
  console.dir(allBidsBigObj)
  console.log("/".repeat(20))

  // ALL BID LOGIC
    socket.on("msg_sent", function(data) {
      console.log("this pack id " + data.packId);

      var userId = data.userId;
      var userBid = data.bid;
      var userName = data.userName;

      if(allBidsBigObj[data.packId] == undefined){
        allBidsBigObj[data.packId] = [];
      }

      allBidsBigObj[data.packId].push({
        userId: data.userId,
        bid: data.bid,
        name: data.userName
      })
      console.log("/".repeat(20) + " after upd allBidsBigObj " + "/".repeat(20) )
      console.dir(allBidsBigObj)
      Package.findById(data.packId).exec(
        function(err, data){
          if(err){
            console.log("error occured " + err);
          } else {
            if(data!=null) {

              data.bids.push({
                userId: userId,
                bidAmount: userBid,
                name: userName
              });
              data.save(function(err){
                if(err){
                  console.log("error when saving: " + err);
                } else{
                  console.log("successfully ");
                }
              })
            }
          }
        }
      )

      console.log( "bid placed: " + data.bid )

      var uniqChatUpdateId = 'update_chat' + data.packId;
      console.log(data.packId);

      // PREVIOUS VERSION FROM CHAT LOGIC
      io.emit(uniqChatUpdateId, {
        lastBid: data.bid,
        userBidLast: data.userName
      } )

    })

    socket.on("page_refresh", function(data) {
      var uniqChatUpdateId = 'update_chat' + data.pId;
      var packId = data.pId;

      console.log("/".repeat(20) + " packId on page_refresh " + "/".repeat(20) )
      console.log(packId);

      if(allBidsBigObj[packId] ==  undefined){
          io.emit(uniqChatUpdateId, {
            lastBid:"none",
            userBidLast:"nobody"
          })
      } else {
          io.emit(uniqChatUpdateId, {
            lastBid: allBidsBigObj[packId][allBidsBigObj[packId].length-1].bid,
            userBidLast: allBidsBigObj[packId][allBidsBigObj[packId].length-1].name,
            socket_current_bid: this.lastBid
          })
      }

    })

    socket.on("disconnect", () => console.log("Client disconnected"));
  // ALL BID LOGIC


})
