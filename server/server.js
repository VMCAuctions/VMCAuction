// *******
// ALL SERVER CODE MOVED TO VMCAuction/server.js
// *******

// var express = require("express");
// var app = express();
// var session = require('express-session');
// var secret = require('./config/secret.json')
// require('jsdom-global');
// require("pdfmake/build/pdfmake.js");
// require("pdfmake/build/vfs_fonts.js");

// var mongoose = require('mongoose'),
// 	Schema = mongoose.Schema,
// 	autoIncrement = require('mongoose-auto-increment');
// mongoose.Promise = global.Promise;


// // Test change for github branch serverjs

// app.use(session({
//   secret: secret.secret,
//   resave: false,
//   saveUninitialized: true,
//   rolling: true
// 	//resets session timeout everytime the user interacts with the site
// }));

// // app.on("Category initializer", function(){
// // 	console.log("entered category initializer")
// // 	if(Category.checkIfEmpty() === true){
// // 		console.log("checkIfEmpty ran")
// // 		Category.initialize()
// // 	}
// // })

// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// var path = require("path");
// app.use(express.static("../public"));

// if (process.env.NODE_ENV === "production") {
// 		app.use(express.static(path.join(__dirname, "/../wireframe")));
// }else{
// 		app.use(express.static(path.join(__dirname, "/../wireframe")));
// }

// app.set('views', path.join(__dirname, '../wireframe'));
// app.set('view engine', 'ejs');

// require('./config/mongoose.js');
// require('./config/initialize.js');

// var routesSetter = require('./config/routes.js');
// routesSetter(app);


// var port = process.env.PORT || 8000;
// var server = app.listen(port, function() {
//  console.log("listening on port "+port);
// })



// ALL SOCKETS CODE LEFT ALONE

/////////////// SOCKETS /////////////////
var Package = require('./models/package.js')
var User = require('./models/user.js');

var svr = require('../server.js');
console.log("100 Sockets.  svr = require server.js = ",svr)

var io = require('socket.io').listen(server);


var allBidsBigObj = {
	// package1: [
	//     {bid: 150, name: "Yarik"},
	//     {bid: 200 name: "Brendan"}
	//   ]
}
// oblect to store the state of "place bid" button enabled/disabled
var packagesButtonStates = {};

// SELF INVOCING FUNCTION WHICH SHOULD BE CALLED ONCE JUST AFTER SERVER STARTED
// IT WILL FILL UP OUR SERVER OBJECTS "allBidsBigObj" and "packagesButtonStates" WITH
// INFO AND ALL BUTTON ENABLED FLAGS
(function(){
	Package.find({}).exec(function(err,pkgs){
		if(err) {
			console.log("init Server object error", err)
		}else{
			for(let i=0; i<pkgs.length; i++){
				// all buttons are enabled
				packagesButtonStates[pkgs[i]._id] = {};
				packagesButtonStates[pkgs[i]._id].buttonstate = true;
				// all latest bid info will be in serverAllBidsObject now
				allBidsBigObj[pkgs[i]._id] = [];
					if(pkgs[i].bids.length != 0){
							allBidsBigObj[pkgs[i]._id].push({
								bid: pkgs[i].bids[pkgs[i].bids.length-1].bidAmount,
								name: pkgs[i].bids[pkgs[i].bids.length-1].name
							});
					}else{
						allBidsBigObj[pkgs[i]._id].push({
							bid: "none",
							name: "nobody"
						});
					}
			}
		}
	})
})()


io.sockets.on('connection', function(socket){
		// THE CHANNEL "msgSent" TO LISTEN ALL BIDS FROM FRONTEND, AND RETURN THEM BACK
		// USING UNIQUE CHANNELS WITH PACKAGE IDs
	socket.on("msgSent", function(data) {

		// THE UNIQUE CHANNEL FOR PARTICULAR PACKAGE WITH IT'S ID IN THE END
		var uniqChatUpdateId = 'updateChat' + data.packId;
		// WE WANT TO DISABLE ALL BUTTONS UNTIL WE UPDATE THE DATABASE AND SERVER OBJECT
		var buttonStateChannel = 'buttonState' + data.packId;
		
		io.emit('buttonStateChannel', {
			button: 'disabled',
			packId: data.packId
		});

		io.emit("serverTalksBack", {packId: data.packId, bid: data.bid, userName: data.userName, name: data.name})

		if(packagesButtonStates[data.packId].buttonstate){
			// NOW NOBODY WILL BE ALLOWED TO MAKE A BID IN THIS PACKAGE UNTILL
			// WE FINISHED TO UPDATE DATABASE SERVER OBJECT ETC.
			packagesButtonStates[data.packId].buttonstate = false;
			var userBid = data.bid;
			var userName = data.userName;

			if(allBidsBigObj[data.packId] == undefined){
				allBidsBigObj[data.packId] = [];
			}

			allBidsBigObj[data.packId].push({
				bid: data.bid,
				name: data.userName
			})

			Package.findById(data.packId).exec(function(err, data){
				if (err){
					console.log("error occured " + err);
				} else if(data != null){
					console.log("120 Sockets.  Pkg.findbyId data = ",data)
					if(data.bids.length == 0 ){
						data.bids.push({
							bidAmount: userBid,
							name: userName
						});
					} else if(data.bids[data.bids.length - 1].bidAmount < userBid ) {
						//if our bids array NOT EMPTY
						data.bids.push({
							bidAmount: userBid,
							name: userName
						});
					}
				}
				// SAVE ALL STUFF
				data.save(function(err){
					if(err){
						console.log("error when saving: " + err);
					}
				})
			})
		}
			
		User.findOne({userName: data.userName}).exec(function(err, user){
			if(err){
				console.log("error occured " + err);
			} else if(user != null){
				console.log("140 Sockets.  User.findbyId user = ",user)
				var duplicatePackage = false;
				for(var i = 0; i < user._packages.length; i++){
					if (user._packages[i] == data.packId){
						duplicatePackage = true;
						break;
					}
				}
				if (duplicatePackage === false){
					user._packages.push(parseInt(data.packId))
					user.save(function(err){
						if(err){
							console.log("error when saving: " + err);
						}
					})
				}
			}
		})
		
		// EMITTING MESSAGE WITH LATEST BID AMOUNT AND BIDDER NAME
		io.emit(uniqChatUpdateId, {
			lastBid: data.bid,
			userBidLast: data.userName
		});

		console.log("180 Sockets.  uniqChatUpdateId = ",uniqChatUpdateId," lastBid(data.bid) = ",lastBid," userBidLast(data.userName) = ",userBidLast);
		
		// NOW WE ENABLING ALL BUTTONS ON THIS PACKAGE TO ALLOW MAKE BIDS FOR OTHERS
		setTimeout(function(){
			io.emit('buttonStateChannel', {
				button: null,
				packId: data.packId
			});
		},1000);
		
		// NOW SOMEBODY ELSE CAN PLACE A BID ON THIS PACKAGE AGAIN
		packagesButtonStates[data.packId].buttonstate = true;

	})

	socket.on("disconnect", () => console.log("Client disconnected"));
})
