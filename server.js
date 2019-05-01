////  CONTAINS SERVER.JS CODE FROM ORIGINAL VMCAuction/server/server.js


var express = require("express");
var app = express();
var session = require('express-session');
var secret = require('./server/config/secret.json')
require('jsdom-global');
require("pdfmake/build/pdfmake.js");
require("pdfmake/build/vfs_fonts.js");

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;

const SimpleNodeLogger = require('./node_modules/simple-node-logger'),
	opts = {
		logFilePath:'./public/vmcLogFile.log',
		timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
	},
fileLog = SimpleNodeLogger.createSimpleFileLogger( opts );

// Test change for github branch serverjs
app.use(session({

	secret: secret.secret,
	resave: false, //Resave the session to store if it's changed
	saveUninitialized: true, //Creates session for anonymous users
	rolling: true //Resets the cookie Max-Age on every user request
	// cookie : { maxAge : 36000000 } //timeout for session time 1 hour
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var path = require("path");
app.use(express.static("./public"));

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/wireframe")));
} else {
	app.use(express.static(path.join(__dirname, "/wireframe")));
}

app.set('views', path.join(__dirname, './wireframe'));
app.set('view engine', 'ejs');

require('./server/config/mongoose.js');
require('./server/config/initialize.js');

var routesSetter = require('./server/config/routes.js');
routesSetter(app);

//this port is pulled out of the secret.json file, which directs to port 8000 for localhost purposes -
//the secret.json file on the deployed server will have an appropriate route that can be used there, allow for auto changes
var port = secret.port;
var server = app.listen(port, function () {
	console.log("listening on port " + port);
})

/////////////// SOCKETS /////////////////
var Package = require('./server/models/package.js')
var User = require('./server/models/user.js');

var io = require('socket.io').listen(server);

var allBidsBigObj = {
	// package1: [
	//     {bid: 150, name: "Yarik",date:"2019-04-11T01:41:26.488Z"},
	//     {bid: 200 name: "Brendan", date" "2019-04-11T01:41:26.488Z"}
	//   ]
}
// oblect to store the state of "place bid" button enabled/disabled
var packagesButtonStates = {};

// SELF INVOCING FUNCTION WHICH SHOULD BE CALLED ONCE JUST AFTER SERVER STARTED
// IT WILL FILL UP OUR SERVER OBJECTS "allBidsBigObj" and "packagesButtonStates" WITH
// INFO AND ALL BUTTON ENABLED FLAGS
(function () {
	fileLog.info("000 server.js start. session = ", JSON.stringify(session, null, 2));
	
	Package.find({}).exec(function (err, pkgs) {
		if (err) {
			console.log("init Server object error", err)
		} else {
			// console.log("100 Server.js Package.find pkgs = ", pkgs)
			for (let i = 0; i < pkgs.length; i++) {
				// all buttons are enabled
				packagesButtonStates[pkgs[i]._id] = {};
				packagesButtonStates[pkgs[i]._id].buttonstate = true;		
				// all latest bid info will be in serverAllBidsObject now
				allBidsBigObj[pkgs[i]._id] = [];
				if (pkgs[i].bids.length != 0) {
					allBidsBigObj[pkgs[i]._id].push({
						bid: pkgs[i].bids[pkgs[i].bids.length - 1].bidAmount,
						name: pkgs[i].bids[pkgs[i].bids.length - 1].name,
						date: pkgs[i].bids[pkgs[i].bids.length - 1].date
					});
				} else {
					allBidsBigObj[pkgs[i]._id].push({
						bid: "none",
						name: "nobody",
						date: "none"
					});
				}
			}
		}
	})
})()


io.sockets.on('connection', function (socket) {
	// THE CHANNEL "msgSent" TO LISTEN ALL BIDS FROM FRONTEND, AND RETURN THEM BACK
	// USING UNIQUE CHANNELS WITH PACKAGE IDs
	socket.on("msgSent", function (data) {
		//creates dates to compare against auction time
		var date = new Date();

		Auction.findById(data.auction, function(err, auction){
			if(err){
				console.log(err);
			} else {
				if(date > auction.endClock){
					console.log("Bid Placed After Auction Ended");
					return;
				} else {
					console.log("050 server.js Auction.findById.  auction = ",auction);
					console.log("051 server.js Auction.findById.  socket.on data = ", data);
					fileLog.info("050 server.js Auction.findById.  auction = ",JSON.stringify(auction, null, 2));
					fileLog.info("051 server.js Auction.findById.  socket.on data = ", JSON.stringify(data, null, 2));

					// THE UNIQUE CHANNEL FOR PARTICULAR PACKAGE WITH IT'S ID IN THE END
					var uniqChatUpdateId = 'updateChat' + data.packId;
					// WE WANT TO DISABLE ALL BUTTONS UNTIL WE UPDATE THE DATABASE AND SERVER OBJECT
					var buttonStateChannel = 'buttonState' + data.packId;

					io.emit('buttonStateChannel', {
						button: 'disabled',
						packId: data.packId
					});

					//function to calculate time ex: '7:30 PM'
					function formatAMPM(date) {
							let hours = date.getHours();
							let minutes = date.getMinutes();
							let ampm;
							if (hours >= 12) {
								ampm = 'pm';
							} else {
								ampm = 'am';
							}
							hours = hours % 12;

							if (hours == 0) {
								hours = 12;
							}
							if (minutes < 10) {
								minutes = '0' + minutes;
							} else {
								minutes;
							}
							let strTime = hours + ':' + minutes + ' ' + ampm;
							return strTime;
						}
					let bidTime = formatAMPM(date);
					
					if (allBidsBigObj[data.packId] == undefined) {
						allBidsBigObj[data.packId] = [];
					}  
					
					if(packagesButtonStates[data.packId] == undefined){
						packagesButtonStates[data.packId] = {buttonstate: "true"};
					}

					if (packagesButtonStates[data.packId].buttonstate) {
						// NOW NOBODY WILL BE ALLOWED TO MAKE A BID IN THIS PACKAGE UNTILL
						// WE FINISHED TO UPDATE DATABASE SERVER OBJECT ETC.
						// console.log("Server Talks Back");
						packagesButtonStates[data.packId].buttonstate = false;
						let userBid = parseInt(data.bid);
						let userName = data.userName;

						allBidsBigObj[data.packId].push({
							bid: data.bid,
							name: data.userName,
							date: date
						})

						Package.findById(data.packId).exec(function (err, package) {
							if (err) {
								console.log("error occured " + err);
							} else if (package != null) {
								fileLog.info("056 server.js Package.findById.  package = ", JSON.stringify(package, null, 2));
								let lastBid;
								if (package.bids.length == 0){
									lastBid = package.amount;
								} else {
									lastBid = parseInt(package.bids[package.bids.length - 1].bidAmount);
								}
								
								// let lastBid = parseInt(package.bids[package.bids.length - 1].bidAmount) || package.amount;
								let packageAmt = package.amount;
								let bidIncrement = package.bidIncrement;
								let = package
								
								//if there are no bids on the package, we check if the userBid is greater than package amount
								if (package.bids.length == 0 && userBid >= packageAmt) {
									package.bids.push({
										bidAmount: userBid,
										name: userName,
										date: date,
										bidTime: bidTime
									});

								//else if there are bids, we check if the userBid is greater than the lastbid plus the increment 
								} else if (userBid >= lastBid + bidIncrement) {
									// console.log("ELSE IF");
									package.bids.push({
										bidAmount: userBid,
										name: userName,
										date: date,
										bidTime:bidTime
									});
								}
							}
							//save all stuff
							package.save(function (err, package) {
								if (err) {
									console.log("error when saving: " + err);
								}
								fileLog.info("056 server.js package.save.  package = ", JSON.stringify(package, null, 2));
							})

							if( package.bids.length == 1 ){

							} else {
								let outBidUser = package.bids[package.bids.length-2].name;
								socket.broadcast.emit('outBidNotification-'+outBidUser, {
									package:package
								});
							}
						})
					}

					User.findOne({ userName: data.userName }).exec(function (err, user) {
						if (err) {
							console.log("error occured " + err);
						} else if (user != null) {
							// console.log("140 Sockets.  User.findbyId user = ",user)
							var duplicatePackage = false;
							for (var i = 0; i < user._packages.length; i++) {
								if (user._packages[i] == data.packId) {
									duplicatePackage = true;
									break;
								}
							}
							if (duplicatePackage === false) {
								user._packages.push(parseInt(data.packId))
								user.save(function (err) {
									if (err) {
										console.log("error when saving: " + err);
									}
								})
							}
						}
					})

					// EMITTING MESSAGE WITH LATEST BID AMOUNT AND BIDDER NAME
					io.emit("serverTalksBack", { packId: data.packId, lastBid: data.bid, userBidLast: data.userName, name: data.name, date: date, bidTime: bidTime})

					// NOW WE ENABLING ALL BUTTONS ON THIS PACKAGE TO ALLOW MAKE BIDS FOR OTHERS
					setTimeout(function () {
						io.emit('buttonStateChannel', {
							button: 'enabled',
							packId: data.packId
						});
					}, 1000);

					// NOW SOMEBODY ELSE CAN PLACE A BID ON THIS PACKAGE AGAIN
					packagesButtonStates[data.packId].buttonstate = true;

				}
			}
		})

	})

	socket.on("disconnect", () => console.log("Server.js Client disconnected"));
})


