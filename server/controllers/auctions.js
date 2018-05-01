var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js');

function AuctionsController(){
  this.index = function(req, res){
    res.render("auctions")
  }
}

module.exports = new AuctionsController();
