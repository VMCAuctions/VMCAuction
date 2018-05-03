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
		console.log("req.body is", req.body)
		Auction.create({
			name: req.body.name
		}, function(err, result){
			if (err){
				console.log(err)
			}
		})
	}
}

module.exports = new AuctionsController();
