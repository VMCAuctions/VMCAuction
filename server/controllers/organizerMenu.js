var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js');

  function organizerMenu(){
    this.index = function(req,res){
      res.render("organizerMenu", {admin: req.session.admin, auction: req.params.auctions, userName: req.session.userName })
    }
  }

module.exports = new organizerMenu();
