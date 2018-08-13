var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js');
	Global = require('../models/global.js');
	globals = require('../controllers/globals.js');

function AuctionsController() {
  	this.index = function(req, res) {
    	res.render("auctions", {admin: req.session.admin, userName: req.session.userName})
	};
	//organizer landing page
	this.main = function(req, res) {
		console.log("req.session.admin", req.session.admin)
		if (req.session.admin) {
			console.log("got inside req.session.admin")
			Auction.find({}, function(err, auctions) {
				if (err) {
				 	console.log(err);
				} else {
					//for now the archivd auctions are hard code.
					//later make an if statemtn hat checks if auction is in past
					//based on clock and todays Date
					//if in past push into archived auctions array
					//else push into current auctions and pass to front
					User.findOne({userName:req.session.userName}, function(err, user){
						if(err){
							console.log(err)
						}
						else{
							console.log("user is", user)
							res.render('main', {user:user,
								auctions: auctions,
								archivedAuctions: [
									{name: "Fall '17 Gala Puttin' on the Ritz", _id: '1001' },
									{name: 'Christmas 2017 Fundraiser', _id: '1002' },
									{name: 'Las Vegas 2017 Donor Evening', _id: '1236' }
								]
							});
						}
					})
				}
			});
		}
		else{
			res.redirect('/' + req.session.auction + '/packages')
		}
	}
	//Just used as an API for now
	this.create = function(req, res){
		// console.log("req.body.startClockDate is", req.body.startClockDate)
		// console.log("req.body.startClockTime is", req.body.startClockTime)
		// Add validations to ensure auction start occurs before auction end
		var startDate = req.body.startClockDate + "T" + req.body.startClockTime + ":00"
		var start = new Date(startDate)
		var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00"
		var end = new Date(endDate)
		//May eventually want to develop another schema that keeps track of all of the unique pins that have not been used between 1000 and 9999, and then pull from there
		Global.findOne({}, function(err, global){
			console.log(global)
			if(err){
				console.log(err)
			}
			if (global.pins.length == 0){
				console.log("Out of available pins!")
			}
			else{
				randomPinIndex = parseInt(Math.floor(Math.random() * 9000))
				randomPin = global.pins[randomPinIndex]
				global.pins.splice(randomPinIndex, 1)

				global.save(function(err,result){
					if(err){
						console.log(err)
					}else{
						Auction.create({
							name: req.body.name,
							subtitle: req.body.subtitle,
							welcomeMessage: req.body.welcomeMessage,
							description:req.body.description,
							venue:req.body.venue,
							startClock: start,
							endClock: end,
							pin: randomPin
						}, function(err, result){
							if (err){
								console.log(err)
							}
							else{
								console.log(result)
								//Perhaps display pin to organizer on creation and/or auction menu page
								res.redirect("/" + result._id + "/organizerMenu")
							}
						});
					}
				})
			}
		})
	}
	this.menu =function(req, res) {
		Auction.findById(req.params.auctions, function(err, auctionDetails) {
			if (err) {
				console.log(err)
			} else {
			    console.log('auction details', auctionDetails)
				res.render('organizerMenu', {
					page: 'organizerMenu',
					admin: req.session.admin,
					auction: req.params.auctions,
					auctionDetails: auctionDetails,
					userName: req.session.userName })
			}
		})
	}
	this.edit = function(req, res){
		Auction.findById(req.params.auctions, function(err, auction){
			stringStartClock = auction.startClock.toISOString()
			stringEndClock = auction.endClock.toISOString()
			// console.log("stringStartClock is", stringStartClock)
			startDate = stringStartClock.substring(0, 10)
			startClock = stringStartClock.substring(11, 16)
			// console.log("startDate is", startDate)
			// console.log("startClock is", startClock)
			endDate = stringEndClock.substring(0, 10)
			endClock = stringEndClock.substring(11, 16)
			res.render("editAuction", {auctionDetails: auction, admin: req.session.admin, userName: req.session.userName, auction: req.params.auctions, startDate: startDate, startClock: startClock, endDate: endDate, endClock: endClock, pin: auction.pin})
		})
	}
	this.event = function(req, res) {
		Auction.findById(req.params.auctions, function(err, auction) {
			stringStartClock = auction.startClock.toISOString()
			stringEndClock = auction.endClock.toISOString()
			startDate = stringStartClock.substring(0, 10)
			startClock = stringStartClock.substring(11, 16)
			endDate = stringEndClock.substring(0, 10)
			endClock = stringEndClock.substring(11, 16)
			if(err){
				console.log(err);
			}
			else{
				res.render("event", {auctionDetails: auction, auction: req.params.auctions, startDate: startDate, startClock: startClock, endDate: endDate, endClock: endClock, pin: auction.pin})
			}
		})	
	}	
		
	this.update = function(req, res) {
		// console.log("req.body is", req.body)
		// console.log("we are in the update function")
		var startDate = req.body.startClockDate + "T" + req.body.startClockTime + ":00"
		var start = new Date(startDate)
		var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00"
		var end = new Date(endDate)
		Auction.findById(req.params.auctions, function(err, auction){
			if(err){
				console.log(err)
			}
			else{
				auction.name = req.body.name || auction.name;
				auction.startClock = start || auction.startClock;
				auction.endClock = end || auction.endClock;
				console.log(req.body.pin)

				newPin = req.body.pin
				newPinInt = parseInt(newPin)
				if (newPin.length != 4 || newPinInt < 1000){
					console.log("invalid pin")
					return ("invalid pin", -1)
				}
				else{
					console.log("pin is valid")
					Global.findOne({}, function(err, result){
						if (err){
							console.log("hit err")
							console.log(err)
						}
						else{
							console.log("found auction")
							availablePins = result.pins
							pinBinarySearch = function(lowerBound, higherBound, pin){
								midIndex = Math.floor(((higherBound - lowerBound) / 2) + lowerBound)
								if (pin == availablePins[midIndex]){
									return ["same", midIndex]
								}
								else if (higherBound - lowerBound <= 0){
									if (availablePins[lowerBound] > pin){
										// 5              4  [5] = index 0 [4, 5] 4 to go in index 0
										return ["high", lowerBound]
									}else{
										// 4              5  [4] = index 0 [4, 5] 5 to go in index 1
										return ["low", lowerBound]
									}
								}
								else{
									if (pin < availablePins[midIndex]){
										return pinBinarySearch(lowerBound, midIndex - 1, pin)
									}
									else{
										return pinBinarySearch(midIndex + 1, higherBound, pin)
									}
								}
							}
							console.log("running pinBinarySearch")
							//Finding if new pin is available in global.pins; this is the previously defined newPinInt
							available = pinBinarySearch(0, availablePins.length - 1, newPinInt)
							console.log("available", available)
							if (available[0] != "same"){
								//Do not allow auction edit and return to edit auction page, probably with a message saying pin is unavailable
								console.log("returning to edit page as pin is not available")
								res.redirect("/" + req.params.auctions + "/organizerMenu")
								return
							}
							//Removing new pin from global.pins array, as it will no longer be available
							availablePins.splice(available[1], 1)
							//Finding where to put the old pin associated with the auction, back into the global.pins array to keep things sorted
							oldPin = parseInt(auction.pin)
							replacing = pinBinarySearch(0, availablePins.length - 1, oldPin)
							if (replacing[0] == "high"){
								result.pins.splice(replacing[1],0,String(oldPin))
							}
							else{
								result.pins.splice(replacing[1] + 1,0,String(oldPin))
							}
							auction.pin = req.body.pin
							auction.save(function(err,auctionsave){
								if(err){
									console.log(err)
								}
								else{
									result.save(function(err,result2){
										if(err){
											console.log(err)
										}
										else{
											//Yay, everything is saved!!!
											res.redirect("/" + req.params.auctions + "/organizerMenu")
										}
									})
								}
							})
						}
					})
				}
			}
		})
	}

	this.pinEntry = function(req, res) {
		res.render("clerks")
	}

	this.pinCheck = function(req, res) {
		//Make a check on auction entry that verifies that pin is unique
		Auction.findOne({pin: req.body.pin}, function(err, auction){
			if(err){
				console.log(err)
			}else if(!auction){
				res.json({match: false})
			}else{
				req.session.userName = "Clerk"
				//Will probably have to implement this such that admins have a req.session.admin of 2, clerks have an admin status of 1, and everyone else has 0. Not sure if we should make the pin be a clerk's username, or build some logic around such that clerks don't have bidding access but do have a pin in their session and something like a username of Clerk.
				req.session.admin = 1
				res.json({match: true, auctions:auction._id})
			}
		})
	}
}

	

module.exports = new AuctionsController();
