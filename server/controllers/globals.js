var mongoose = require('mongoose'),
	Global = require('../models/global.js');

console.log("reached globals.js")

function GlobalsController(){
	this.initialize = function(req, res){
		pins = []
		for (var i = 1000; i <= 9999; i++){
		//Note: As mongoose can't hold Python sets, and these are going to be deleted frequently, we are using a map due to its indexing type even though the "value" part is just dummy data
		pins.push(String(i))
		}
		Global.create({pins: pins}, function(err, result){
		if(err){
			console.log(err)
		}
		})
	}
	this.adminValidation = function(req, res) {
		
		if (req.session.admin != 2){

			// //IMPORTANT - this code prevents being kicked out due to session.admin / session.auction = undefined errors
			// //REMOVE FOR PRODUCTION!!

			// req.session.admin = "2";
			// req.session.auction = "5c59f82b181b703674c1eca5"; // localhost Getting the Shiny Gold auction

			// console.log("globals.js adminVal.  hard coded session data = req.ses.admin = ",req.session.admin," req.ses = ",req.session)

			// return true

			// //END

			// res.redirect('/' + req.session.auction + '/packages')
			res.redirect('/users/adminError')
			return false
		}
		return true
	}
	
	// ?????
	this.clerkValidation = function(req, res) {
		if (req.session.admin == 0){
			res.redirect('/' + req.session.auction + '/packages')
			return false
		}
		return true
	}
	this.notClerkValidation = function(req, res) {
		if (req.session.admin == 1){
			res.redirect('/' + req.session.auction + '/packages')
			return false
		}
		return true
	}	

	// this.canBid = function(req, res) {
	// 	var start, end, curTime, canBid;
	// 	Auction.findById(req.params.auctions, function(err, auctionDetails) {
	// 		if (err) {
	// 		  console.log(err);
	// 		} else {
	// 			console.log("210 auctions.js this.menu.  req.session = ",req.session);
	// 			start = auctionDetails.startClock;
	// 			end = auctionDetails.endClock;
	// 			curTime = dateNow();
	// 			canBid = (curTime >= start && curTime <= end)
	// 			console.log("100 globals.js this.canBid.  start, end, curTime, canBid = ", start, " | ", end, " | ", curTime, " | ", canBid);
	// 		}
	// 	});
	// }

}

module.exports = new GlobalsController();
