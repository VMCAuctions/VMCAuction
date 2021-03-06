var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js'),
	Auction = require('../models/auction.js'),
	globals = require('../controllers/globals.js')

	
var ObjectId = require('mongodb').ObjectId;
var multer = require('multer')

const SimpleNodeLogger = require('../../node_modules/simple-node-logger'),
    opts = {
        logFilePath:'./public/vmcLogFile.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
fileLog = SimpleNodeLogger.createSimpleFileLogger( opts );

function PackagesController() {

	// from app.get('/:auctions/packages') - renders catalog page (packages.ejs)
	this.index = function (req, res) {

		// console.log("000 packages.js this.index start. req.session = ", req.session);
		fileLog.info("000 packages.js this.index start. req.session = ", JSON.stringify(req.session, null, 2));
		fileLog.info("001 packages.js this.index start. req.params = ", JSON.stringify(req.params, null, 2));

		if (!req.session.userName) {
			// console.log('001 packages.js this.index in if !req.session.username');
			fileLog.info('001 packages.js this.index in if !req.session.username');
			req.session.auction = req.params.auctions
		}
		var user
		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
				fileLog.info(err);
			}
			else {

				User.findOne({ userName: req.session.userName }, function (err, user) {
					// console.log("004 packages.js this.index user.findOne.  user = ", user)
					fileLog.info("004 packages.js this.index user.findOne.  user = ", JSON.stringify(user, null, 2));

					if (err) {
						console.log(err);
						file.log(err);
						if (req.session.admin === 2) {
							res.redirect('/users/adminError');
						} 
						if (req.session.admin === 0) {
							res.redirect('/users/supporterError');
						}
						
					} else {
						
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.params.auctions}).populate("_items").sort({_id:'ascending'}).exec(function(err, packages) {
							if(err) {
								console.log('packages.js this.index Package Index Error');
								res.status(500).send('packages.js this.index Failed to Load Packages');
								console.error();
							} else {
								fileLog.info("006 packages.js this.index Package.find.  packages = ", JSON.stringify(packages, null, 2));
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
										fileLog.info("008 packages.js this.index Auction findById. auctionDetails = ", JSON.stringify(auctionDetails, null, 2));
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
						console.log(err);
						if (req.session.admin === 2) {
							res.redirect('/users/adminError');
						} 
						if (req.session.admin === 0) {
							res.redirect('/users/supporterError');
						}
					} else {
						user = result
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.params.auctions}).populate("_items").sort({priority: 'ascending'}).sort({_id:'ascending'}).exec(function(err, packages) {
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
						console.log(err);
						res.redirect('/users/adminError');
					} else {
						user = result

						Package.find({ _auctions: req.params.auctions }).populate("_items").sort({ _category: 'ascending' }).sort({_id:'ascending'}).exec(function (err, packages) {
							if (err) {
								console.log('packages.js this.uprights Package Register Error');
								res.status(500).send('packages.js this.uprights Failed to Load Packages');
								console.error();
							} else {
								console.log("packages.js this.uprights req.session is", req.session)
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
									console.log("100 packages.js this.uprights.  sortedPackages = ",sortedPackages);
								
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

	// from app.get('/:auctions/packages/list'.  renders Package Register (packageRegister.ejs)
	this.list = function (req, res) {
		fileLog.info("050 packages.js this.list start. req.session = ", JSON.stringify(req.session, null, 2));
		fileLog.info("051 packages.js this.list start. req.params = ", JSON.stringify(req.params, null, 2));
		if (!req.session.userName) {
			req.session.auction = req.params.auctions
		}
		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
			}
			else {
				User.findOne({ userName: req.session.userName }, function (err, user) {
					if (err) {
						console.log(err);
						res.redirect('/users/adminError');
					} else {
						fileLog.info("054 packages.js this.list user.findOne.  user = ", JSON.stringify(user, null, 2));
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
		} else {
			res.redirect('/users/adminError');
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
			} else {
				res.redirect('/users/adminError');
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
		fileLog.info("080 packages.js this.show start. req.session = ", JSON.stringify(req.session, null, 2));
		fileLog.info("081 packages.js this.show start. req.params = ", JSON.stringify(req.params, null, 2));
		console.log("082 packages.js this.show start. req.session = ", req.session);
		var resultPackages;
		// This is the method that finds all of the packages from the database and stores them in packages
		Package.find({ _auctions: req.params.auctions }).populate("_items").exec(function (err, packages) {
			if (err) {
				console.log(err);
			} else {
				fileLog.info("082 packages.js this.show package.find packages = ", JSON.stringify(packages,null,2));
				var featured = [];
				var nonfeatured = [];
				for (var i = 0; i < packages.length; i++) {
					// console.log("082 packages.js this.show.  Package.find.  packages[i].featured = ",packages[i].featured)
					fileLog.info("082 packages.js this.show.  Package.find.  packages[i].featured = ",packages[i].featured)
					if (packages[i].featured === true) {
						featured.push(packages[i]);
					}
					//Not actually using nonfeatured packages right now
					else {
						nonfeatured.push(packages[i]);
					}
				}
				resultPackages = packages;
				if (resultPackages) {
					fileLog.info("083 packages.js this.show.  Package.find.  resultPackages[0] = ",JSON.stringify(resultPackages[0], null, 2));
				} else {
					fileLog.info("083 packages.js this.show.  Package.find.  !resultPackages so can't print packages");
				}
				// console.log("083 packages.js this.show.  Package.find.  resultPackages[0] = ",JSON.stringify(resultPackages[0], null, 2))
				User.findOne({ userName: req.session.userName }, function (err, user) {
					if (err) {
						console.log(err)
						if (req.session.admin === 2) {
							res.redirect('/users/adminError');
						} 
						if (req.session.admin === 0) {
							res.redirect('/users/supporterError');
						}
					} else {
						fileLog.info("084 packages.js this.show user.findOne.  user = ", JSON.stringify(user, null, 2));
						console.log("084 packages.js this.show user.findOne.  user = ",JSON.stringify(user, null, 2));
						Package.findById(req.params.id).populate("_items").exec(function (err, package) {
							if (err) {
								console.log(err);
							}
							else {
								fileLog.info("085 packages.js this.show package.findById package = ", JSON.stringify(package,null,2));
								// console.log("085 packages.js this.show package.findById package = ", JSON.stringify(package,null,2));
								var ourBids = false
								var lastBid = package.amount
								if (package.bids.length > 0) {
									ourBids = true;
									// lastBid = package.bids[package.bids.length - 1].bidAmount
									if (package.bids){
										lastBid = package.bids[package.bids.length - 1].bidAmount
										// console.log("086 packages.js this.show package.findById inside package.bids.  lastBid = ",lastBid);
										fileLog.info("086 packages.js this.show package.findById inside package.bids");
										fileLog.info("087 lastBid = package.bids[package.bids.length - 1].bidAmount = ",lastBid);
									} else {
										lastBid = package.amount;
										// console.log("086 packages.js this.show package.findById inside !package.bids");
										fileLog.info("086 packages.js this.show package.findById inside !package.bids");
										fileLog.info("087 lastBid = package.amount = ",lastBid);
									}
								}
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {
										fileLog.info("088 packages.js this.show auction.findById auctionDetails = ", JSON.stringify(auctionDetails,null,2));
										//Gets current position of the package in the resultPackages object
										fileLog.info("089 packages.js this.show auction.findById resultPackages.length = ",resultPackages.length);
										// console.log("089 packages.js this.show.  Auction.findById.  resultPackages.length = ",resultPackages.length)
										for( var i = 0; i < resultPackages.length; i++){
											if(resultPackages[i]._id == package._id){
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
			}
		});
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
		} else {
			res.redirect('/users/adminError');
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
		} else {
			res.redirect('/users/adminError');
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
							console.log(err);
							res.redirect('/users/adminError');
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
		} else {
			res.redirect('/users/adminError');
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
		} else {
			res.redirect('/users/adminError');
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

	// Launches a supporter session without having to log in.  Used by team for including VMC project in resumes
	// NOT part of delivered app!
	this.guest = function (req, res) {

		// hard code auction
		req.session.auctions = "5c8c111dcc231c37a5ebc440"; // dv1.elizabid.com Fly High Fly Far auction
		// hard code auction - Getting the Shiny Gold
		// req.session.auctions = "5c59f82b181b703674c1eca5"; // Bob's localhost Getting the Shiny Gold auction
		// hard code admin = 0
		req.session.admin = 0;
		// hard code userName = Guest Guest (fn ln) (in dv1 Fly High Fly Far auction)
		req.session.userName = "guest@guest.com";
		// hard code userName = Annabel Andreesen (in Bob's database, not yours!)
		// req.session.userName = "aaaa@a.com";
		console.log("601 packages.js this.guest .  req.session = ",req.session);

		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
			}
			else {
				User.findOne({ userName: req.session.userName }, function (err, user) {
					console.log("602 packages.js this.index user.findOne.  result = ", user)
					if (err) {
						console.log(err)
					} else {
						console.log("602 packages.js this.guest User.findOne.  user = ",user);
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.session.auctions}).populate("_items").sort({_category: 'ascending'}).sort({_id:'ascending'}).exec(function(err, packages) {
							if(err) {
								console.log('603 packages.js this.index Package Index Error');
								res.status(500).send('603 packages.js this.guest Failed to Load Packages');
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

								console.log("606 packages.js this.guest pre Auction.findById. req.params = ",req.params);
								Auction.findById(req.session.auctions, function (err, auctionDetails) {
									if (err) {
										console.log('607 packages.js this.guest Package.find.  Auction.findById.  err = ',  err)
									} else {
										console.log("607 packages.js this.guest Package.find.  Auction.findById.  auctionDetails = ", auctionDetails);
										fileLog.info("607 packages.js this.guest Auction.findById.  auctionDetails = ", JSON.stringify(auctionDetails, null, 2));

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

	// supporter text message auction link route day of auction to access app on phone
	// from app.get('/users/sendSMS' - renders catalog page for supporters (catalog.ejs)
	this.liveAuction = function(req,res){
		console.log("220 packages.js this.liveAuction start. req.session = ",req.session);
		console.log("221 packages.js this.liveAuction start. req.params = ",req.params);
		fileLog.info("220 packages.js this.liveAuction start. init req.session = ", JSON.stringify(req.session, null, 2));
		fileLog.info("221 packages.js this.liveAuction start. req.params = ", JSON.stringify(req.params, null, 2));
		Category.find({}, function(err, categories) {
			if(err) {
				console.log(err);
			}
			else {
				User.findById(req.params.id, function(err, user){
					console.log("222 packages.js this.liveAuction user.findById.  user = ",user)
					fileLog.info("222 packages.js this.liveAuction user.findById.  user = ", JSON.stringify(user, null, 2));
					if(err){
						console.log(err)
					}else{
						req.session.admin = 0;
						req.session.userName = user.userName;
						req.session.user = user;
						req.session.auction = req.params.auctions;
						console.log("224 packages.js this.liveAuction User.findById.  post assign req.session = ",req.session);
						fileLog.info("224 packages.js this.liveAuction User.findById.  post assign req.session = ", JSON.stringify(req.session, null, 2));
						// This is the method that finds all of the packages from the database
						Package.find({_auctions: req.params.auctions}).populate("_items").sort({_category: 'ascending'}).sort({priority: 'ascending'}).sort({_id:'descending'}).exec(function(err, packages) {
							if(err) {
								console.log('packages.js this.liveAuction Package.find Package Index Error');
								res.status(500).send('packages.js this.liveAuction Package.find Failed to Load Packages');
								console.error();
							}else {
								console.log("226 packages.js this.liveAuction Package.find.  packages[0] = ",packages[0]);
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
								console.log("227 packages.js this.liveAuction pre Auction.findById. req.params = ",req.params);
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log('227.5 packages.js this.liveAuction Package.find.  Auction.findById.  err = ',  err)
									} else {
										console.log("228 packages.js this.liveAuction Package.find.  Auction.findById.  auctionDetails = ", auctionDetails);
										fileLog.info("228 packages.js this.liveAuction Auction.findById.  auctionDetails = ", JSON.stringify(auctionDetails, null, 2));
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
											auction: req.session.auction,
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
