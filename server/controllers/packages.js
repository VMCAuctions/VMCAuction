var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js'),
	globals = require('../controllers/globals.js')
var ObjectId = require('mongodb').ObjectId;

function PackagesController(){

	this.index = function(req,res){
		console.log('100 packages.js this.index.  req.params = ',req.params);
		console.log('101 packages.js this.index.  req.body = ',req.body);
		if (!req.session.userName){
	  	req.session.auction = req.params.auctions
		}
		var user
		Category.find({}, function(err, categories) {
			if(err) {
				console.log(err);
			}
			else {
				User.findOne({userName:req.session.userName}, function(err, result){
					if(err){
						console.log(err)
					}else{
						user = result
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.params.auctions}).populate("_items").sort({_category: 'ascending'}).sort({priority: 'ascending'}).sort({_id:'descending'}).exec(function(err, packages) {
							if(err) {
									console.log('Package Index Error');
									res.status(500).send('Failed to Load Packages');
									console.error();
							}else {
									// console.log('this is user again', user)
									var featured = [];
									var nonfeatured = [];
									for (var i = 0; i < packages.length; i++){
										if(packages[i].featured === true){
											featured.push(packages[i]);
										}
										//Not actually using nonfeatured packages right now
										else{
											nonfeatured.push(packages[i]);
										}
									}
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {
										console.log("req.session is", req.session)
										res.render('packages', {
											page: 'catalog',
											packages: packages,
											admin: req.session.admin,
											userName: req.session.userName,
											user: user,
											categories: categories,
											featured: featured,
											nonfeatured: nonfeatured,
											auction: req.params.auctions,
											auctionDetails: auctionDetails,
										})
									}
								})
							}
						})
					}
				})
			}
		})
	};

	this.list = function (req, res) {
		console.log('PackagesController list');
		if (!req.session.userName) {
			req.session.auction = req.params.auctions
		}
		var user
		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
			}
			else {
				User.findOne({ userName: req.session.userName }, function (err, result) {
					if (err) {
						console.log(err)
					} else {
						user = result

						Package.find({ _auctions: req.params.auctions }).populate("_items").sort({ _id: 'ascending' }).exec(function (err, packages) {
							if (err) {
								console.log('Package Register Error');
								res.status(500).send('Failed to Load Packages');
								console.error();
							} else {
								console.log("req.session is", req.session)
								let sumMarketVal = 0;
								let sumStartingBid = 0;
								let featured = [];
								let nonFeatured = [];
								for (let i=0; i < packages.length; i++) {
									sumMarketVal += packages[i].value;
									sumStartingBid += packages[i].amount;
									if (packages[i].featured){
										//currently, package priorities range from 1 to 10
										featured[packages[i].priority - 1] = packages[i]
									}else{
										nonFeatured.push(packages[i])
									}
								}
								sortedPackages = []
								for (index in featured){
									if (featured[index] != undefined){
										sortedPackages.push(featured[index])
									}
								}
								sortedPackages = sortedPackages.concat(nonFeatured)

								res.render('packageRegister', {
									page: 'register',
									packages: sortedPackages,
									sumMarketVal: sumMarketVal,
									sumStartingBid: sumStartingBid,
									admin: req.session.admin,
									userName: req.session.userName,
									user: user,
									auction: req.params.auctions,
									categories: categories,
								})
							}
						})
					}
				})
			}
		})
	};

	this.edit = function(req,res){
		console.log('PackagesController new');
		if (globals.adminValidation(req, res)){
			var categoryArray = [];
			var itemsArray = [];
			var total = 0;
			Package.findById(req.params.id).populate("_items").exec(function(err,result){
				if(err){
					console.log(err);
				}
				else{
					Category.find({}, function(err, categories) {
							if(err) {
									console.log(err);
									res.status(500).send('Failed to Load Items');
							}
							else {
								Item.find({_auctions: req.params.auctions}, function(err, items) {
									if(err) {
											console.log(err);
											res.status(500).send('Failed to Load Items');
									}
									else {
										console.log(total);
										for(let i = 0; i<items.length; i++){
											 if(!items[i].packaged){
												 itemsArray.push(items[i]);
												 console.log(itemsArray);
										 	}
										}
										 for(let i = 0; i < result._items.length; i++){
											total += result._items[i].value;
										 	console.log(result._items[i]);
										 }
										console.log("result is", result)
										res.render('packageEdit', {package: result, categories: categories, items: itemsArray, total: total, userName: req.session.userName, admin: req.session.admin, auction: req.params.auctions})
									}
								})
							}
					})
				}
			})
		}
	}

this.new = function(req,res){
	if (globals.adminValidation(req, res)){
		var itemsArray = [];
		Item.find({_auctions: req.params.auctions}, function(err, items) {
				if(err) {
						console.log(err);
						res.status(500).send('Failed to Load Items');
				}
				else {
					Category.find({}, function(err, categories) {
							if(err) {
									console.log(err);
									res.status(500).send('Failed to Load Items');
							}
							else {
								console.log(itemsArray);
								res.render('packageCreate', {page: 'createPackage', categories: categories, items: items, userName: req.session.userName, admin: req.session.admin, auction: req.params.auctions})
							}
							console.log('PackagesController new =>');
					})
				}
		})
	}
}

	//post method that creats packages
	this.create = function(req,res){
		console.log('PackagesController create');
		console.log('selected items' ,req.body)
		//following should never get triggered.
		//front end validations should take care of it
		if (req.body.selectedItems.length == 0){
      console.log('reached empty item list')
		  return res.json(false)
    }
    Package.create({
			name: req.body.packageName,
			_items: req.body.selectedItems,
			description: req.body.packageDescription,
			value: req.body.totalValue,
			bidIncrement: req.body.increments,
			_category: req.body.category,
			bid: [],
			amount: req.body.openingBid,
			featured: req.body.featured,
			restrictions: req.body.packageRestrictions,
			_auctions: req.params.auctions
		}, function(err, package){
			if(err){
				console.log(err);
				return;
		   }
		   else{
				 for(let i = 0; i < package._items.length; i++ ){
						Item.findOne({_id: package._items[i]} , function(err, item){
								item.packaged = true;
								item._package = package._id;
								item.save(function (err){
									if (err){
										console.log(err)
									}
								})
						})
					}
					res.redirect('/' + req.params.auctions  + '/packages/new?true')
			 }
		});
	};


	this.show = function(req,res){
		console.log('PackagesController show');
		var user
		User.findOne({userName:req.session.userName}, function(err, result){
			if(err){
				console.log(err)
			}else{
				user = result
				Package.findById(req.params.id).populate("_items").exec(function(err,package){
					if(err){
						console.log(err);
					}
					else{
						console.log(package)
						var ourBids = false
						var lastBid = package.amount
						if(package.bids.length > 0){
							ourBids = true;
							lastBid = package.bids[package.bids.length -1 ].bidAmount
						}
						Auction.findById(req.params.auctions, function (err, auctionDetails) {
							if (err) {
								console.log(err)
							} else {
								res.render('packageShow', {
									package: package,
									userName: req.session.userName,
									admin: req.session.admin,
									user: user,
									ourBids: ourBids,
									lastBid: lastBid,
									auction: req.params.auctions,
									auctionDetails: auctionDetails,
								})
							}
						})
					}
				})
			}
		})
	};

	this.update = function(req,res){
		console.log('PackagesController update');
		if (globals.adminValidation(req, res)){
			Package.findById(req.params.id, function (err, package) {
				console.log(package);
			    if (err) {
			        res.status(500).send(err);
			    }else {
							Item.find({_id: package._items}, function(err, items) {
								if (err) {
									console.log(err);
								}else{
									for (var i = 0; i < items.length; i++) {
										//Setting all of the items to unpackaged, just in case they are removed and not put back into the package
										//Items that remain in the package will be repackaged below
										items[i].packaged = false;
										items[i]._package = null;
										items[i].save()
									}
								}
							})
			        // Update each attribute with value that was submitted in the body of the request
			        // If that attribute isn't in the request body, default back to whatever it was before.
			        package.name = req.body.packageName || package.name;
					package.description = req.body.packageDescription || package.description;
					package.restrictions = req.body.packageRestrictions || package.restrictions;
					package.bids[0] = req.body.openingBid || package.bids[0];
					package.value = req.body.totalValue || package.value;
					package.amount = req.body.openingBid || package.amount;
			        package.bidIncrement = req.body.increments || package.bidIncrement;
			        package._category = req.body.category || package._category;
					package.priority = req.body.priority || package.priority;
					package._items = req.body.selectedItems;
			        package.save(function (err, package) {
			            if (err) {
	                    console.log(err)
			                res.status(500).send(err)
			            }else{
			    					for(let i = 0; i < package._items.length; i++ ){
											Item.findOne({_id: package._items[i]} , function(err, item){
												item.packaged = true;
												item._package = package.id;
												item.save(function (err){
													if (err){
														console.log(err)
													}else{
														console.log('item should  be packaged', item.packaged);
													}
												})
											})
			    					}
										res.redirect('/' + req.params.auctions  + '/packages/' + package._id );
			           }
			       });
			    }
			});
		}
	}

	this.removePackage = function(req, res){
		if (globals.adminValidation(req, res)){
			console.log('in remove package')
			Package.findOne({_id: req.params.id}, function(err, package){
				if(err){
					console.log(err)
				}else{
						//everything in the User.find will probably never be used
						//this searches all users and removes package from their watchlist
						//it should only happen if an in the middle of an auction if item is reported as stolen
						//or provider of service suddenly goes out of buisness
						User.find({_auctions: req.params.auctions}, function(err, users){
							if(err){
								console.log(err)
							}else{
								for(var k= 0; k< users; k++ ){
									for (var i = 0; i < users[k]._package.length; i++) {
										if(package._id === users[k]._packages[i]){
											users[k]._packages.splice(i,1)
										}
									}
								}
								if (users[k]) {
									users[k].save(function(err,result){
										if(err){
											console.log(err)
											res.status(500).send(err)
										}
									})
								}
								Auction.findById(package._auctions, function(err, auction){
									if (err){
										console.log(err)
									}
									else{
										auction._packages.splice(auction._packages.indexOf(package._auctions), 1)
									}
								})
							}
						})
					for(var i = 0; i < package._items.length; i++){
						Item.update({_id: package._items[i]}, {$set: {packaged: false, _package: null}}, function(err, result){
							if(err){
								console.log(err)
							}
						});
					}
					Package.remove({_id: req.params.id}, function(err, package){
						if(err){
							console.log(err)
						}else{
							res.redirect('/' + req.params.auctions  + '/packages');
						}
					})
				}
			})
		}
	}


	this.featured = function(req, res) {
		if (globals.adminValidation(req, res)){
			Package.findById(req.params.id, function(err, package) {
				if(err){
					console.log(err);
				}else if (package.featured === true) {
					package.featured = false;
				}else{
					package.featured = true;
				}
				package.save()
				res.redirect('/' + req.params.auctions  + '/packages')
			})
		}
	}


	this.cancelBid = function(req,res){
		if (globals.adminValidation(req, res)){
			Package.findById(req.params.id, function(err,package){
				if(err){
					console.log(err)
				}else{
					var bid	= package.bids[package.bids.length - 1]
					if(req.body.user){
						User.findOne({userName: req.body.user}, function(err,user){
							if(err){
								console.log(err)
							}else{
								if(bid.name === user.userName){
									package.bids.pop()
									package.save();
								}
							}
						})
					}
					res.redirect('/' + req.params.auctions  + '/packages/' + package._id)
				}
			})
		}else{
			res.redirect('/packages')
		}
	}

	this.priority = function(req,res){
		if (req.params.priority < 1 || req.params.priority > 10){
			res.json(`Priority ${req.params.priority} is invalid.  Please choose a unique priority value between 1 and 10.`)
		}
		else{
			//May be possible to not search priority for non-featured package
			Package.findOne({"_auctions": req.params.auctions, "priority": req.params.priority}, function(err, copy){
				if (copy != null && req.params.featured === "true"){
					res.json(`Priority ${req.params.priority} is already in use.  Please choose a unique priority value.`)
				}
				else{
					Package.findById(req.params.id, function(err, result){
						result.featured = req.params.featured
						if (req.params.featured === "true"){
							result.priority = req.params.priority
						}
						else{
							result.priority = -1
						}
						result.save(function(err){
							if (err){
								console.log(err)
								res.json(`Error occurred while attempting to modify package id ${result._id}. Please try again.`)
							}
							else{
								console.log("Successful package modification")
								res.json(`Package id ${result._id} modified successfully!`)
							}
						})
					})
				}
			})
		}
	}
}

module.exports = new PackagesController();
