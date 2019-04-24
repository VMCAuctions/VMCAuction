var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js'),
	globals = require('../controllers/globals.js')

	
var ObjectId = require('mongodb').ObjectId;
var multer = require('multer')

function PackagesController() {

	this.index = function (req, res) {
		// console.log("000 packages.js this.index start. req.session = ", req.session);
		if (!req.session.userName) {
			// console.log('001 packages.js this.index in if !req.session.username');
			req.session.auction = req.params.auctions
		}
		var user
		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
			}
			else {
				User.findOne({ userName: req.session.userName }, function (err, result) {
					// console.log("004 packages.js this.index user.findOne.  result = ", result)
					if (err) {
						console.log(err)
					} else {
						user = result
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.params.auctions}).populate("_items").sort({_category: 'ascending'}).sort({_id:'ascending'}).exec(function(err, packages) {
							if(err) {
								console.log('packages.js this.index Package Index Error');
								res.status(500).send('packages.js this.index Failed to Load Packages');
								console.error();
							} else {
								// console.log('this is user again', user)
								var featured = [];
								var nonfeatured = [];
								for (var i = 0; i < packages.length; i++) {
									if (packages[i].featured === true) {
								-		featured.push(packages[i]);
									}
									//Not actually using nonfeatured packages right now
									else {
										nonfeatured.push(packages[i]);
									}
								}
								//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page	
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {
										var userDisplay = user.firstName.charAt(0).toUpperCase() + "." + " " + user.lastName;
										//current is a flag showing which page is active
										res.render('packages', {
											current: 'catalog',
											packages: packages,
											admin: req.session.admin,
											userName: req.session.userName,
											user: user,
											userDisplay: userDisplay,
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


	this.featuredPackages = function (req, res) {
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
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.params.auctions}).populate("_items").sort({_category: 'ascending'}).sort({priority: 'ascending'}).sort({_id:'ascending'}).exec(function(err, packages) {
							if(err) {

								console.log('packages.js this.index Package Index Error');
								res.status(500).send('packages.js this.index Failed to Load Packages');
								console.error();
							} else {
								// console.log('this is user again', user)
								var featured = [];
								var nonfeatured = [];
								for (var i = 0; i < packages.length; i++) {
									if (packages[i].featured === true) {
										featured.push(packages[i]);
									}
									//Not actually using nonfeatured packages right now
									else {
										nonfeatured.push(packages[i]);
									}
								}
						
								//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page	
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {
										var userDisplay = user.firstName.charAt(0).toUpperCase() + "." + " " + user.lastName;
										//current is a flag showing which page is active
										res.render('featuredPackages', {
											current: 'featured-packages',
											packages: packages,
											admin: req.session.admin,
											userName: req.session.userName,
											user: user,
											userDisplay: userDisplay,
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

	this.uprights = function (req, res) {
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

						Package.find({ _auctions: req.params.auctions }).populate("_items").sort({ _category: 'ascending' }).sort({_id:'ascending'}).exec(function (err, packages) {
							if (err) {
								console.log('packages.js this.list Package Register Error');
								res.status(500).send('Failed to Load Packages');
								console.error();
							} else {
								console.log("packages.js this.list req.session is", req.session)
								let featured = [];
								let nonFeatured = [];
								for (let i=0; i < packages.length; i++) {
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
									console.log("100 packages.js this.list.  sortedPackages = ",sortedPackages);
								
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {
										res.render('packageUprights', {
											packages: sortedPackages,
											admin: req.session.admin,
											userName: req.session.userName,
											user: user,
											auction: req.params.auctions,
											auctionDetails: auctionDetails,
											categories: categories,
										})
									}
								}	
							)}
						})
					}
				})
			}
		})
	};

	this.list = function (req, res) {
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
								console.log('packages.js this.list Package Register Error');
								res.status(500).send('Failed to Load Packages');
								console.error();
							} else {
								// console.log("packages.js this.list req.session is", req.session)
								let sumMarketVal = 0;
								let sumStartingBid = 0;
								let featured = [];
								let nonFeatured = [];
								for (let i = 0; i < packages.length; i++) {
									sumMarketVal += packages[i].value;
									sumStartingBid += packages[i].amount;
									if (packages[i].featured) {
										//currently, package priorities range from 1 to 10
										featured[packages[i].priority - 1] = packages[i]
									} else {
										nonFeatured.push(packages[i])
									}
								}
								sortedPackages = []
								for (index in featured) {
									if (featured[index] != undefined) {
										sortedPackages.push(featured[index])
									}
								}
								sortedPackages = sortedPackages.concat(nonFeatured)

								// console.log("100 packages.js this.list.  sortedPackages = ",sortedPackages);

                Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {
										res.render('packageRegister', {
											current: 'package-register',
											packages: sortedPackages,
											sumMarketVal: sumMarketVal,
											sumStartingBid: sumStartingBid,
											admin: req.session.admin,
											userName: req.session.userName,
											user: user,
											auction: req.params.auctions,
											auctionDetails: auctionDetails,
											categories: categories,
										})
									}
								}
								)
							}
						})
					}
				})
			}
		})
	};


	this.edit = function(req,res){
		if (globals.adminValidation(req, res)){
			var packageItems =[];
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
							res.status(500).send('packages.js this.edit.  Failed to Load Categories');
						}
						else {
							console.log("100 packages.js this.edit Cat.find.  categories = ",categories)
							// console.log("101 packages.js this.edit categories[0].name = ",categories[0].name);
							Item.find({_package: result._id  }, function(err, packageItems) {
								if(err) {
									console.log(err);
									res.status(500).send('packages.js this.edit.  Failed to find items in this package');
								}
								else {
									packageItems = packageItems;
									for (var i in packageItems){

									}
								}
							})

							Item.find({_auctions: req.params.auctions}, function(err, items) {
								if(err) {
									console.log(err);
									res.status(500).send('packages.js this.edit.  Failed to Load Items');
								}
								else {

									for(let i = 0; i<items.length; i++){
										if(!items[i].packaged || items[i]._package == req.params.id){
											itemsArray.push(items[i]);
										}
									}

									for(let i = 0; i < result._items.length; i++){
										total += result._items[i].value;
									}
									Auction.findById(req.params.auctions, function (err, auctionDetails) {
										if (err) {
											console.log(err)
										} else {

											res.render('packageEdit', {
												package: result,
												packageItems: packageItems,
												categories: categories,
												items: itemsArray,
												total: total,
												userName: req.session.userName,
												admin: req.session.admin,
												auction: req.params.auctions,
												auctionDetails: auctionDetails,
												photo: result.photo
											})
										}
									})

								}

							})
						}
					})
				}
			})
		}
	}


	this.new = function(req,res){
		console.log(Date.now() + " - 000 packages.js this.new start.  req.body = ",req.body);
		console.log(Date.now() + " - 000 packages.js this.new start.  req.params = ",req.params);
		if (globals.adminValidation(req, res)){
			var total = 0;
			var itemsArray = [];
			Item.find({_auctions: req.params.auctions}, function(err, items) {

					if(err) {
						console.log(Date.now() + " - 001 packages.js this.new Items.find error. err = ",err);

						res.status(500).send('Failed to Load Items');
					}
					else {
						// console.log(Date.now() + " - 002 packages.js this.new Items.find. items = ",items);
						Category.find({}, function (err, categories) {
							if (err) {
								console.log("006 packages.js this.new category.find error. err = ", err);
								res.status(500).send('Failed to find categories');
							}
							else {

								for(let i = 0; i<items.length; i++){
									if(!items[i].packaged || items[i]._package == req.params.id){
										itemsArray.push(items[i]);
									}
							}

								Auction.findById(req.params.auctions, function (err, auctionDetails){

									if (err) {
										console.log(err)
									} else {
										res.render('packageCreate', {
											current: 'createPackage',
											categories: categories,
											items: itemsArray,
											total: total,
											userName: req.session.userName,
											admin: req.session.admin,
											auction: req.params.auctions,
											auctionDetails: auctionDetails
										})
									}
								})
							}
							
						})
					}

				})
			}
		};

	//post method that creates packages

	this.create = function(req,res){
		console.log("101 packages.js this.create req.body.category = ",req.body.category);
		console.log("101 packages.js this.create start. req.file = ",req.file);
		console.log("100 packages.js this.create start. req.body = ",req.body);
		console.log("102 packages.js this.create start. req.params = ",req.params);

		var cat = req.body.category[0];
		console.log("102 packages.js this.create start. cat=r.b.category[0]  cat = ",cat);
		
		Package.create({
			// name: req.body.packageName,
			name: req.body.name,
			_items: req.body.selectedItems,
			description: req.body.packageDescription,
			value: req.body.totalValue,
			bidIncrement: req.body.increments,
			// _category: req.body.category,
			donors: req.body.donors,
			cat: cat,
			_category: cat,
			bid: [],
			amount: req.body.openingBid,
			featured: req.body.featured,
			restrictions: req.body.packageRestrictions,

			photo: req.body.imgFileName,

			_auctions: req.params.auctions
		}, function (err, package) {
			if (err) {
				console.log(err);
				return;
			}
			else {
				console.log(Date.now() + " - 104 packages.js this.create post create.  req.body = ", req.body);
				console.log(Date.now() + " - 105 packages.js this.create post create.  req.file = ", req.file);
				console.log(Date.now() + " - 106 packages.js this.create post create.  package = ", package);
				for (let i = 0; i < package._items.length; i++) {
					Item.findOne({ _id: package._items[i] }, function (err, item) {
						item.packaged = true;
						item._package = package._id;
						item.save(function (err) {
							if (err) {
								console.log(err)
							}
						})
					})
				}
				res.redirect('/' + req.params.auctions + '/packages/new?true')
			}
		});
	};

	this.show = function (req, res) {
		console.log('this.show packages.ejs');
		var resultPackages;
		// This is the method that finds all of the packages from the database and stores them in
		//resultPackages
		Package.find({ _auctions: req.params.auctions }).populate("_items").exec(function (err, packages) {
			if (err) {
				console.log('packages.js this.index Package Index Error');
				res.status(500).send('packages.js this.index Failed to Load Packages');
				console.error();
			} else {
				// console.log('this is user again', user)
				var featured = [];
				var nonfeatured = [];
				for (var i = 0; i < packages.length; i++) {
					if (packages[i].featured === true) {
						featured.push(packages[i]);
					}
					//Not actually using nonfeatured packages right now
					else {
						nonfeatured.push(packages[i]);
					}
				}
				resultPackages = packages;
			}
		});

		User.findOne({ userName: req.session.userName }, function (err, user) {
			if (err) {
				console.log(err)
			} else {
				// console.log("100 packages.js this.show User.findOne.  user = ",user)
				Package.findById(req.params.id).populate("_items").exec(function (err, package) {
					if (err) {
						console.log(err);
					}
					else {
						// console.log("100 packages.js this.show Package.findById.  package = ",package)
						var ourBids = false
						var lastBid = package.amount
						if (package.bids.length > 0) {
							ourBids = true;
							lastBid = package.bids[package.bids.length - 1].bidAmount
						}
						Auction.findById(req.params.auctions, function (err, auctionDetails) {
							if (err) {
								console.log(err)
							} else {
								//Gets current position of the package in the resultPackages object
								for( var i =0; i<resultPackages.length;i++){
									if(resultPackages[i]._id == package._id){
										// console.log(resultPackages[i]._id);
										//return index of the found package on pos
										var pos = resultPackages.map(function(e) { return e._id; }).indexOf(resultPackages[i]._id);
									}
								}
								//increments position for next page
								if(pos < resultPackages.length-1){
									nextPos = pos+1;
								}else{
									nextPos = 0;
								}
								//decrements position to go to previous page
								if(pos < resultPackages.length && pos > 0){
									prevPos = pos-1;
								}else{
									prevPos = resultPackages.length-1;
								}
								res.render('packageShow', {
									nextPos: resultPackages[nextPos]._id,
									prevPos: resultPackages[prevPos]._id,
									package: package,
									userName: req.session.userName,
									admin: req.session.admin,
									user: user,
									ourBids: ourBids,
									lastBid: parseInt(lastBid),
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
		console.log("220 packages.js this.update start.  req.body = ",req.body);
		console.log("220 packages.js this.update start.  req.body.category = ",req.body.category);
		// console.log("221 packages.js this.update start.  req.file = ",req.file);
		var cat = req.body.category[0];
		console.log("222 packages.js this.update start. cat=r.b.category[0]  cat = ",cat);
		
		if (globals.adminValidation(req, res)){
			Package.findById(req.params.id, function (err, package) {
				console.log("224 packages.js this.update pkg.findById.  package = ",package);
				if (err) {
					res.status(500).send(err);
				}else {
					Item.find({_id: package._items}, function(err, items) {

						if (err) {
							console.log(err);
						} else {
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
					package.name = req.body.name || package.name;
					package.description = req.body.packageDescription || package.description;
					package.restrictions = req.body.packageRestrictions || package.restrictions;
					package.bids[0] = req.body.openingBid || package.bids[0];
					package.value = req.body.totalValue || package.value;
					package.amount = req.body.openingBid || package.amount;
					package.bidIncrement = req.body.increments || package.bidIncrement;

					package._category = cat || package._category;
					package.priority = req.body.priority || package.priority;
					package._items = req.body.selectedItems;
					package.donors = req.body.donors  || package.donors;

					// For image upload
					package.photo = req.body.imgFileName || package.photo;

					package.save(function (err, package) {
						if (err) {
							console.log(err)
							res.status(500).send(err)

						}else{
							console.log("226 packages.js this.update post pkg.save.  package = ",package);
							for(let i = 0; i < package._items.length; i++ ){
								Item.findOne({_id: package._items[i]} , function(err, item){

									item.packaged = true;
									item._package = package.id;
									item.save(function (err) {
										if (err) {
											console.log(err)
										} else {
											console.log('packages.js this.update item should  be packaged', item.packaged);
										}
									})
								})
							}
							// 1-17 Bug Fix List Item 7 Change redirect to Package Register
							// res.redirect('/' + req.params.auctions  + '/packages/' + package._id );
							res.redirect('/' + req.params.auctions + '/packages/list');
						}
					});
				}
			});
		}
	}


	this.itemsUpdate = function (req, res) {
		console.log(Date.now(), " - 220 packages.js this.itemsUpdate start.  req.body = ", req.body);

		// if (globals.adminValidation(req, res)){
		// 	Package.findById(req.params.id, function (err, package) {
		// 		console.log(Date.now()," - 224 packages.js this.update pkg.findById result = ",package);
		// 		if (err) {
		// 	        res.status(500).send(err);
		// 	    }else {
		// 			Item.find({_id: package._items}, function(err, items) {
		// 				if (err) {
		// 					console.log(err);
		// 				}else{
		// 					for (var i = 0; i < items.length; i++) {
		// 						//Setting all of the items to unpackaged, just in case they are removed and not put back into the package
		// 						//Items that remain in the package will be repackaged below
		// 						items[i].packaged = false;
		// 						items[i]._package = null;
		// 						items[i].save()
		// 					}
		// 				}
		// 			})
		// 			// Update each attribute with value that was submitted in the body of the request
		// 			// If that attribute isn't in the request body, default back to whatever it was before.
		// 	  	package.name = req.body.name || package.name;
		// 			package.description = req.body.packageDescription || package.description;
		// 			package.restrictions = req.body.packageRestrictions || package.restrictions;
		// 			package.bids[0] = req.body.openingBid || package.bids[0];
		// 			package.value = req.body.totalValue || package.value;
		// 			package.amount = req.body.openingBid || package.amount;
		// 	    package.bidIncrement = req.body.increments || package.bidIncrement;
		// 	    package._category = req.body.category || package._category;
		// 			package.priority = req.body.priority || package.priority;
		// 			package._items = req.body.selectedItems;

		// 			// For image upload
		// 			package.photo = req.body.imgFileName || package.photo;


		// 	        package.save(function (err, package) {
		// 	            if (err) {
		//                   console.log(err)
		// 	                res.status(500).send(err)
		// 	            }else{
		// 					console.log(Date.now()," - 226 packages.js this.update post pkg.save.  package = ",package);
		// 					for(let i = 0; i < package._items.length; i++ ){
		// 						Item.findOne({_id: package._items[i]} , function(err, item){
		// 							item.packaged = true;
		// 							item._package = package.id;
		// 							item.save(function (err){
		// 								if (err){
		// 									console.log(err)
		// 								}else{
		// 									console.log('packages.js this.update item should  be packaged', item.packaged);
		// 								}
		// 							})
		// 						})
		// 					}
		// 					// 1-17 Bug Fix List Item 7 Change redirect to Package Register
		// 					// res.redirect('/' + req.params.auctions  + '/packages/' + package._id );
		// 					res.redirect('/' + req.params.auctions  + '/packages/list' );
		// 	           }
		// 	       });
		// 	    }
		// 	});
		// }
	}

	this.removePackage = function (req, res) {
		if (globals.adminValidation(req, res)) {
			console.log('packages.js this.removePackage in remove package')
			Package.findOne({ _id: req.params.id }, function (err, package) {
				if (err) {
					console.log(err)
				} else {
					//everything in the User.find will probably never be used
					//this searches all users and removes package from their watchlist
					//it should only happen if an in the middle of an auction if item is reported as stolen
					//or provider of service suddenly goes out of buisness
					User.find({ _auctions: req.params.auctions }, function (err, users) {
						if (err) {
							console.log(err)
						} else {
							for (var k = 0; k < users; k++) {
								for (var i = 0; i < users[k]._package.length; i++) {
									if (package._id === users[k]._packages[i]) {
										users[k]._packages.splice(i, 1)
									}
								}
							}
							if (users[k]) {
								users[k].save(function (err, result) {
									if (err) {
										console.log(err)
										res.status(500).send(err)
									}
								})
							}
							Auction.findById(package._auctions, function (err, auction) {
								if (err) {
									console.log(err)
								}
								else {
									auction._packages.splice(auction._packages.indexOf(package._auctions), 1)
								}
							})
						}
					})
					for (var i = 0; i < package._items.length; i++) {
						Item.update({ _id: package._items[i] }, { $set: { packaged: false, _package: null } }, function (err, result) {
							if (err) {
								console.log(err)
							}
						});
					}
					Package.remove({ _id: req.params.id }, function (err, package) {
						if (err) {
							console.log(err)
						} else {
							// res.redirect('/' + req.params.auctions  + '/packages');
							// 1-17 Bug Fix List Item 45 change delete package redirect to packages register
							res.redirect('/' + req.params.auctions + '/packages/list');
						}
					})
				}
			})
		}
	}

	this.removePackageFromUprights = function (req, res) {
		if (globals.adminValidation(req, res)) {
			console.log('packages.js this.removePackage in remove package')
			Package.findOne({ _id: req.params.id }, function (err, package) {
				if (err) {
					console.log(err)
				} else {
					//everything in the User.find will probably never be used
					//this searches all users and removes package from their watchlist
					//it should only happen if an in the middle of an auction if item is reported as stolen
					//or provider of service suddenly goes out of buisness
					User.find({ _auctions: req.params.auctions }, function (err, users) {
						if (err) {
							console.log(err)
						} else {
							for (var k = 0; k < users; k++) {
								for (var i = 0; i < users[k]._package.length; i++) {
									if (package._id === users[k]._packages[i]) {
										users[k]._packages.splice(i, 1)
									}
								}
							}
							if (users[k]) {
								users[k].save(function (err, result) {
									if (err) {
										console.log(err)
										res.status(500).send(err)
									}
								})
							}
							Auction.findById(package._auctions, function (err, auction) {
								if (err) {
									console.log(err)
								}
								else {
									auction._packages.splice(auction._packages.indexOf(package._auctions), 1)
								}
							})
						}
					})
					for (var i = 0; i < package._items.length; i++) {
						Item.update({ _id: package._items[i] }, { $set: { packaged: false, _package: null } }, function (err, result) {
							if (err) {
								console.log(err)
							}
						});
					}
					Package.remove({ _id: req.params.id }, function (err, package) {
						if (err) {
							console.log(err)
						} else {
							// res.redirect('/' + req.params.auctions  + '/packages');
							// 1-17 Bug Fix List Item 45 change delete package redirect to packages register
							res.redirect('/' + req.params.auctions + '/packages/uprights');
						}
					})
				}
			})
		}
	}


	this.featured = function (req, res) {
		if (globals.adminValidation(req, res)) {
			Package.findById(req.params.id, function (err, package) {
				if (err) {
					console.log(err);
				} else if (package.featured === true) {
					package.featured = false;
				} else {
					package.featured = true;
				}
				package.save()
				res.redirect('/' + req.params.auctions + '/packages')
			})
		}
	}
	
	this.cancelBid = function (req, res) {
		if (globals.adminValidation(req, res)) {
			Package.findById(req.params.id, function (err, package) {
				if (err) {
					console.log(err)
				} else {
					var bid = package.bids[package.bids.length - 1]
					if (req.body.user) {
						User.findOne({ userName: req.body.user }, function (err, user) {
							if (err) {
								console.log(err)
							} else {
								if (bid.name === user.userName) {
									package.bids.pop()
									package.save();
								}
							}
						})
					}
					res.redirect('/' + req.params.auctions + '/packages/' + package._id)
				}
			})
		} else {
			res.redirect('/packages')
		}
	}

	this.priority = function (req, res) {
		if (req.params.priority < 1 || req.params.priority > 10) {
			res.json(`Priority ${req.params.priority} is invalid.  Please choose a unique priority value between 1 and 10.`)
		}
		else {
			//May be possible to not search priority for non-featured package
			Package.findOne({ "_auctions": req.params.auctions, "priority": req.params.priority }, function (err, copy) {
				if (copy != null && req.params.featured === "true") {
					res.json(`Priority ${req.params.priority} is already in use.  Please choose a unique priority value.`)
				}
				else {
					Package.findById(req.params.id, function (err, result) {
						result.featured = req.params.featured
						if (req.params.featured === "true") {
							result.priority = req.params.priority
						}
						else {
							result.priority = -1
						}
						result.save(function (err) {
							if (err) {
								console.log(err)
								res.json(`packages.js this.priority Error occurred while attempting to modify package id ${result._id}. Please try again.`)
							}
							else {
								console.log("packages.js this.priority Successful package modification")
								res.json(`Package id ${result._id} modified successfully!`)
							}
						})
					})
				}
			})
		}
	}

	this.liveAuction = function(req,res){
		console.log("000 packages.js this.liveAuction start. req.params = ",req.params);
		Category.find({}, function(err, categories) {
			if(err) {
				console.log(err);
			}
			else {
				User.findById(req.params.id, function(err, user){
					console.log("002 packages.js this.liveAuction user.findById.  user = ",user)
					if(err){
						console.log(err)
					}else{
						req.session.admin = 0;
						req.session.userName = user.userName;
						req.session.user = user;
						req.session.auctions = req.params.auctions;
						console.log("004 packages.js this.liveAuction. req.session = ",req.session);
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.params.auctions}).populate("_items").sort({_category: 'ascending'}).sort({priority: 'ascending'}).sort({_id:'descending'}).exec(function(err, packages) {
							if(err) {
								console.log('packages.js this.liveAuction Package.find Package Index Error');
								res.status(500).send('packages.js this.liveAuction Package.find Failed to Load Packages');
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
								//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page	
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {
										var userDisplay = user.firstName.charAt(0).toUpperCase() + "." + " " + user.lastName;
										//current is a flag showing which page is active
										res.render('packages', {
											current: 'catalog',
											packages: packages,
											admin: req.session.admin,
											userName: req.session.userName,
											user: user,
											userDisplay: userDisplay, 
											categories: categories,
											featured: featured,
											nonfeatured: nonfeatured,
											auction: req.session.auctions,
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
	}
	
}

module.exports = new PackagesController();
