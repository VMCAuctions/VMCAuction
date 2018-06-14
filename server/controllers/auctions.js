var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js');

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
				res.redirect("/" + result._id + "/organizerMenu")
			}
		});
	}
	this.menu =function(req, res) {
		res.render('organizerMenu', {page: 'organizerMenu', admin: req.session.admin, auction: req.params.auctions, userName: req.session.userName })
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
