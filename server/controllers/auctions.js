var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js');

function AuctionsController(){
  this.index = function(req, res){
    res.render("auctions", {admin: req.session.admin, userName: req.session.userName})
  };
	//Just used as an API for now
	this.create = function(req, res){
		// console.log("req.body.startClockDate is", req.body.startClockDate)
		// console.log("req.body.startClockTime is", req.body.startClockTime)
		var startDate = req.body.startClockDate + "T" + req.body.startClockTime + ":00"
		var start = new Date(startDate)
		var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00"
		var end = new Date(endDate)
		Auction.create({
			name: req.body.name,
			startClock: start,
			endClock: end
		}, function(err, result){
			if (err){
				console.log(err)
			}
			else{
				console.log(result)
				res.redirect("/" + result._id)
			}
		})
	}
	this.menu =function(req, res) {
		res.render('organizerMenu', {admin: req.session.admin, auction: req.params.auctions, userName: req.session.userName })
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

}

module.exports = new AuctionsController();
