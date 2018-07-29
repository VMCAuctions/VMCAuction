var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Category = require('../models/category.js'),
	Package = require('../models/package.js'),
	Auction = require('../models/auction.js');
	globals = require('../controllers/globals.js')

function ItemsController(){

	this.index = function(req,res){
		console.log('ItemsController index');
		if (globals.adminValidation(req, res)){
			Category.find({}, function (err, categories) {
				if (err) {
					console.log(err);
				}else{
					Item.find({_auctions: req.params.auctions}).populate("_package").sort({_category:'ascending'}).exec(function(err, items){
							if(err){
									console.log(err);
									res.status(500).send('Failed to Load Items');
							}else{
								res.render('items', {page:'items', items: items, admin: req.session.admin, userName: req.session.userName, categories: categories, auction: req.params.auctions})
							}
					})
				}
			})
		}
	};


	this.new = function(req,res){
		if (globals.adminValidation(req, res)){
			Category.find({}, function(err, categories) {
		    	if(err) {
		      		console.log(err);
		      		res.status(500).send('Failed to Load Items');
		    	}else{
						if(req.session.admin){
							res.render('createItem', {page:'addItem', categories: categories, userName: req.session.userName, admin: req.session.admin, auction: req.params.auctions})
						}else{
							res.redirect('/' + req.params.auctions + '/packages')
						}
					}
			console.log('ItemsController new');
			});
		}
	}
	this.create = function(req,res){
		if (globals.adminValidation(req, res)){
			console.log('ItemsController create');
	    Item.create({name: req.body.itemName, description: req.body.itemDescription,
	      _category: req.body.category, donorFirst: req.body.donorFirst, donorLast: req.body.donorLast, donorDisplay: req.body.donorDisplay, restrictions: req.body.itemRestriction, value: req.body.fairMarketValue, packaged: false, priority: req.body.priority, _auctions: req.params.auctions},  function(err, result){
	      if(err){
	        console.log(err);
	        res.status(500).send('Failed to Create Item');
	      }else{
	        res.redirect('/' + req.params.auctions + '/items/new?true')
	      }
	    });
		}
	};


	this.edit = function(req,res){
		console.log('ItemsController edit');
		if (globals.adminValidation(req, res)){
			Item.findById(req.params.id, function(err, result){
				if(err){
		        console.log(err);
		     }else{
					Category.find({}, function(err, categories) {
						if(err) {
						  console.log(err);
						  res.status(500).send('Failed to Load Items');
						}else if(req.session.admin){
							res.render('itemEdit', {item:result, categories:categories, userName: req.session.userName, admin: req.session.admin, auction: req.params.auctions});
						}else{
							res.redirect('/' + req.params.auctions + '/packages')
						}
					})
			  }
			})
		}
	}


	this.update = function(req,res){
		console.log('ItemsController update');
		if (globals.adminValidation(req, res)){
			Item.findById(req.params.id, function (err, item) {
		    if (err) {
	          console.log(err);
		        res.status(500).send('Failed to Update Item');
		    }else {
						//Saving old value to check whether it changes; if it does, you'll want to perform a package.find
						oldValue = item.value
		        // Update each attribute with value that was submitted in the body of the request
		        // If that attribute isn't in the request body, default back to whatever it was before.
		        item.name = req.body.itemName || item.name;
		        item.description = req.body.itemDescription || item.description;
		        item.donorFirst = req.body.donorFirst || item.donorFirst;
						item.donorLast = req.body.donorLast || item.donorLast;
						item.donorDisplay = req.body.donorDisplay || item.donorDisplay;
		        item.restrictions = req.body.itemRestriction || item.restrictions;
		        item.value = req.body.fairMarketValue || item.value;
		        item._category = req.body.category || item._category;
		        item.save(function (err, item) {
		            if (err) {
	                  console.log(err)
		                res.status(500).send('Failed to Save Item update')
		            }else if (req.body.fairMarketValue != oldValue && item.packaged === true){
										Package.findById(item._package, function(err, package){
											package.value -= oldValue
											package.value += item.value
											package.save(function (err, result){
												if (err){
													console.error();
												}
											})
										})
								}
								res.redirect('/' + req.params.auctions + '/items')
	          });
		    }
		  });
		}
	}


	this.removeItem = function(req, res){
		if (globals.adminValidation(req, res)){
			var val
			var pack
			Item.findById(req.params.id, function(err, item) {
				if (err) {
					console.error();
				}else {
					val = item.value;
					pack = item._package;
					Item.remove({_id: req.params.id}, function(err, result){
						if(err){
							console.log(err)
						}else{
							console.log(pack);
							console.log(val);
							Package.findById(pack, function (err, package) {
								if (err) {
									console.error();
								}else if (package != null){
									package.value -= val;
									package._items.splice(package._items.indexOf(item._id), 1)
									package.save(function (err, result) {
										if (err) {
											console.error();
										}
									})
									if (package.value === 0) {
										package.remove(package, function (err, result) {
											if (err) {
												console.error();
											}
											else{
												Auction.removeById(item._auctions, function(err, auction){
													if(err){
														console.log(err)
													}
												})
											}
										})
									}
								}
							})
							res.redirect('/' + req.params.auctions + '/items')
						}
					})
				}
			})
		}
	}
	this.populatePage = function(req, res){
		//May need to add validation checks so that only admins can see
		console.log("reached this.populatePage")
		res.render('itemPopulator', {admin: req.session.admin, userName: req.session.userName, auction: req.params.auctions})
	}
	this.populate = function(req, res){
		//May need to add validation checks so that only admins can see
		//This is where the code, that actually populates from the CSV, will be placed
		console.log("reached this.populate")
		res.redirect('/' + req.params.auctions + '/items/populate')
	}
}

module.exports = new ItemsController();
