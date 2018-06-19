var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js');
	Global = require('../models/global.js');

function AuctionsController() {
  	this.index = function(req, res) {
    	res.render("auctions", {admin: req.session.admin, userName: req.session.userName})
	};
	//organizer landing page
	this.main = function(req, res) {
		if (req.session.admin) {
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
		// Only for testing purposes, when don't yet have access as admin
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
				res.render('organizerMenu', {admin: req.session.admin, auction: auctionDetails, userName: req.session.userName })
			}
		})
	}
	this.update = function(req, res) {
		var startDate = req.body.startClockDate + "T" + req.body.startClockTime + ":00"
		var start = new Date(startDate)
		var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00"
		var end = new Date(endDate)
		Auction.find({_id: req.params.auctions}, function(err, auction){
			if(err){
				console.log(err)
			}
			else{
				auction.name = req.body.name || auction.name;
				auction.startClock = start || auction.startClock;
				auction.endClock = end || auction.endClock;
				auction.save(function(err,result){
					if(err){
						console.log(err)
					}
					else{
						//Redirect to organizer menu
					}
				})
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
