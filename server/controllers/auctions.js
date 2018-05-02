var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js');

function AuctionsController(){
  this.index = function(req, res){
    res.render("auctions", {admin: req.session.admin, userName: req.session.userName})
  }
}

module.exports = new AuctionsController();
