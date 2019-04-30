var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Category = require('../models/category.js'),
	Package = require('../models/package.js'),
	Auction = require('../models/auction.js');
globals = require('../controllers/globals.js')
const csv = require('csvtojson')

function ItemsController() {

	this.index = function (req, res) {
		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
			} else {
				Item.find({ _auctions: req.params.auctions }).populate("_package").sort({ _category: 'ascending' }).exec(function (err, items) {
					if (err) {
						console.log(err);
						res.status(500).send('Failed to Load Items');
					} else {
						console.log("001 items.js this.index Item.find.  items = ", items)
						//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page
						Auction.findById(req.params.auctions, function (err, auctionDetails) {
							if (err) {
								console.log(err)
							} else {
								//current is a flag showing which page is active
								res.render('items', {
									current: 'item-register',
									items: items,
									admin: req.session.admin,
									userName: req.session.userName,
									categories: categories,
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

	this.new = function (req, res) {
		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
				res.status(500).send('Failed to Load Items');
			} else {
				if (req.session.admin) {
					//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page
					Auction.findById(req.params.auctions, function (err, auctionDetails) {
						if (err) {
							console.log(err);
						} else {
							//current is a flag showing which page is active
							res.render('createItem', {
								current: 'addItem',
								categories: categories,
								userName: req.session.userName,
								admin: req.session.admin,
								auction: req.params.auctions,
								auctionDetails: auctionDetails,
							})
						}
					})
				} else {
					res.redirect('/users/adminError');
				}
			}
		})
	};

	this.create = function (req, res) {
		console.log('ItemsController create');
		console.log("donor display:", req.body.donorAnonymous);
		let donorDisplay = "Anonymous";
		if (!req.body.donorAnonymous) {
			if (req.body.donorOrg) {
				donorDisplay = req.body.donorOrg;
			} else {
				if (req.body.donorFirst) {
					donorDisplay = req.body.donorPrefix + " " + req.body.donorFirst.charAt(0).toUpperCase() + "." + " " + req.body.donorLast;
				} else {
					donorDisplay = req.body.donorPrefix + " " + req.body.donorLast;
				}
			}
		}
		Item.create({
			name: req.body.itemName,
			description: req.body.itemDescription,
			_category: req.body.category,
			donorPrefix: req.body.donorPrefix,
			donorFirst: req.body.donorFirst,
			donorLast: req.body.donorLast,
			donorOrg: req.body.donorOrg,
			donorDisplay: donorDisplay,
			restrictions: req.body.itemRestriction,
			value: req.body.fairMarketValue,
			packaged: false,
			priority: req.body.priority,
			_auctions: req.params.auctions
		}, function (err, result) {
			if (err) {
				console.log(err);
				res.status(500).send('Failed to Create Item');
			} else {
				res.redirect('/' + req.params.auctions + '/items/new?true')
			}
		});
	};

	this.edit = function (req, res) {
		Item.findById(req.params.id, function (err, result) {
			if (err) {
				console.log(err);
			} else {
				Category.find({}, function (err, categories) {
					if (err) {
						console.log(err);
						res.status(500).send('Failed to Load Items');
					} else if (req.session.admin) {
						//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page
						Auction.findById(req.params.auctions, function (err, auctionDetails) {
							if (err) {
								console.log(err)
							} else {
								res.render('itemEdit', {
									item: result,
									categories: categories,
									userName: req.session.userName,
									admin: req.session.admin,
									auction: req.params.auctions,
									auctionDetails: auctionDetails,
								});
							}
						})
					} else {
						res.redirect('/users/adminError');
					}
				})
			}
		})
	};


	this.update = function (req, res) {
		// console.log("400 items.js this.itemsCsv start")
		// console.log("381 items.js this.update.  req.body = ", req.body)
		// console.log("382 items.js this.update.  req.session = ", req.session)
		// console.log("383 items.js this.update.  req.params = ", req.params)
		if (globals.adminValidation(req, res)) {
			Item.findById(req.params.id, function (err, item) {
				if (err) {
					console.log(err);
					res.status(500).send('Failed to Update Item');
				} else {
					// console.log("384 items.js this.update Item.findById.  item = ", item)
					//Saving old value to check whether it changes; if it does, you'll want to perform a package.find
					oldValue = item.value
					// Update each attribute with value that was submitted in the body of the request
					// If that attribute isn't in the request body, default back to whatever it was before.
					item.name = req.body.itemName || item.name;
					item.description = req.body.itemDescription || item.description;
					item.donorPrefix = req.body.donorPrefix || item.donorPrefix;
					item.donorFirst = req.body.donorFirst || item.donorFirst;
					item.donorLast = req.body.donorLast || item.donorLast;
					item.donorOrg = req.body.donorOrg || item.donorOrg;
					item.donorDisplay = req.body.donorDisplay || item.donorDisplay;
					item.restrictions = req.body.itemRestriction || item.restrictions;
					item.value = req.body.fairMarketValue || item.value;
					item._category = req.body.category || item._category;
					item._auctions = req.params.auctions || item._auction;
					item.save(function (err, item) {
						if (err) {
							console.log(err)
							// console.log("384 items.js this.update Item.findById.  item = ", item)
							res.status(500).send('Failed to Save Item update')
						} else if (req.body.fairMarketValue != oldValue && item.packaged === true) {
							Package.findById(item._package, function (err, package) {
								package.value -= oldValue
								package.value += item.value
								package.save(function (err, result) {
									if (err) {
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


	this.removeItem = function (req, res) {
		console.log("600 items.js this.removeItem.  req.params = ",req.params)
		if (globals.adminValidation(req, res)) {
			var val
			var pack
			Item.findById(req.params.id, function (err, item) {
				if (err) {
					console.error();
				} else {
					console.log("602 items.js this.removeItem.  item = ",item)
					val = item.value;
					pack = item._package;
					Item.remove({ _id: req.params.id }, function (err, result) {
						if (err) {
							console.log(err)
						} else {
							console.log("604 items.js this.removeItem.  result = ",result)
							// console.log(pack);
							// console.log(val);
							Package.findById(pack, function (err, package) {
								if (err) {
									console.error();
								} else if (package != null) {
									package.value -= val;
									package._items.splice(package._items.indexOf(item._id), 1)
									package.save(function (err, result) {
										if (err) {
											console.error();
										}
									})
									Auction.removeById(item._auctions, function (err, auction) {
										if (err) {
											console.log(err)
										}
									})
									// if (package.value === 0) {
									// 	package.remove(package, function (err, result) {
									// 		if (err) {
									// 			console.error();
									// 		}
									// 		else {
									// 			Auction.removeById(item._auctions, function (err, auction) {
									// 				if (err) {
									// 					console.log(err)
									// 				}
									// 			})
									// 		}
									// 	})
									// }
								}
							})
							res.redirect('/' + req.params.auctions + '/items')
						}
					})
				}
			})
		}
	}

	this.populatePage = function (req, res) {
		//May need to add validation checks so that only admins can see
		// console.log("300 items.js this.populatePage start")
		Auction.findById(req.params.auctions, function (err, auctionDetails) {
			if (err) {
				console.log(err)
			} else {
				// console.log("301 items.js this.populatePage.  r.s.admin = ",req.session.admin," r.p.auctions = ",req.params.auctions)
				// console.log("302 items.js this.populatePage.  auctionDetails = ",auctionDetails)
				res.render('itemPopulator', { admin: req.session.admin, userName: req.session.userName, auction: req.params.auctions, auctionDetails: auctionDetails })
			}
		})
	};

	this.populateCsv = function (req, res) {
		//May need to add validation checks so that only admins can see
		// console.log("310 items.js this.populateCsv start")
		Auction.findById(req.params.auctions, function (err, auctionDetails) {
			if (err) {
				console.log(err)
			} else {
				// console.log("311 items.js this.populateCsv.  r.s.admin = ",req.session.admin," r.p.auctions = ",req.params.auctions)
				res.render('csvUpload', { admin: req.session.admin, userName: req.session.userName, auction: req.params.auctions, auctionDetails: auctionDetails, filename: req.body.csvUpload })
			}
		})
	};

	this.populate = function (req, res) {
		//May need to add validation checks so that only admins can see
		console.log("400 items.js this.populate start")
		// console.log("401 items.js this.populate.  req.body = ", req.body)

		//NOTE: The below should probably be changed to use any file the organizer specifies in the system, probably by using a file upload module, and then ask for that specification on the populate page
		// const csvFilePath="2019 Gala Auction Item Tracker.csv"

		const csvFilePath=("C:/AA_local_Code/MEAN/aa_vmc/VMCAuction/public/" + req.body.csvUpload);
		// const csvFilePath = ("C:/Users/Daniel Lam/Desktop/VMC/VMCAuction/public/");


		// console.log("402 items.js this.populate.  csvFilePath = ",csvFilePath)

		csv()
			.fromFile(csvFilePath)
			.then((jsonObj) => {
				// This jsonObj is a list of json objects, with each json object having the column name as a key and the entry of the row for that column as its value, illustrated below
				// console.log(jsonObj);
				/**
				* [
				* {a:"1", b:"2", c:"3"},
				* {a:"4", b:"5". c:"6"}
				* ]
				*/
				// console.log("403 items.js this.populate.  jsonObj[0] = ", jsonObj[0])
				// console.log("403 items.js this.populate.  jsonObj[0][Item Name] = ", jsonObj[0]["Item Name"])
				// console.log("403 items.js this.populate.  jsonObj = ", jsonObj)

				mandatoryColumns = [
					["Item Name", req.body.itemNameColumn, "name", null],
					["Item Description", req.body.itemDescriptionColumn, "description", null],
					["Value", req.body.itemValueColumn, "value", "number"],
				]
				//Need to add special logic for donor last or donor organization being required
				mandatoryDonorColumns = [
					["Donor Last Name", req.body.itemDonorLastColumn, "donorLast", null],
					["Donor Organization", req.body.itemDonorOrgColumn, "donorOrg", null],
				]
				optionalColumns = [
					["Category", req.body.itemCategoryColumn, "_category", null],
					["Item Restriction", req.body.itemRestrictionsColumn, "restrictions", null],
					["Donor First Name", req.body.itemDonorFirstColumn, "donorFirst", null],
					["Display Donor", req.body.itemDonorDisplayColumn, "donorDisplay", null],
				]

				//The CSV file needs to be in a standardized format to populate correctly; I can't tell the computer where to put each piece of information if there's no systematic ordering of that data (e.g., donor column should be broken into donor first, donor last, and organization, and not have just a few entries that have more than one donor); also, not sure what to do about restrictions and priority as they have no columns

				//Print an error message if there is no column in the csv that matches up with a required item field
				errorString = ""
				console.log("410 items.js this.populate. mandatoryColumns = ", mandatoryColumns)
				for (index in mandatoryColumns) {
					// console.log("410 items.js this.populate. mandatoryColumns[index][1] = ", mandatoryColumns[index][1])
					// if (!jsonObj[0].hasOwnProperty(mandatoryColumns[index][1])){
					if (!jsonObj[0].hasOwnProperty(mandatoryColumns[index][0])) {
						console.log("411 items.js this.populate. jsonObj[0].hasOwnProperty(mandatoryColumns[index][0]) = ", jsonObj[0].hasOwnProperty(mandatoryColumns[index][0]))
						if (mandatoryColumns[index][1] == "") {
							errorString += ("\n" + mandatoryColumns[index][0] + " is a required field, but no value was specified.")
						}
						else {
							errorString += ("\n" + mandatoryColumns[index][0] + " is required, but the specified column, " + mandatoryColumns[index][0] + ", is not a valid column in CSV.")
						}
					}
				}
				validDonorColumns = []
				donorFlag = false
				mandatoryDonorColumnNames = ""
				mandatoryDonorColumnEntries = ""
				for (index in mandatoryDonorColumns) {
					mandatoryDonorColumnNames += (", " + mandatoryDonorColumns[index][0])
					if (mandatoryDonorColumns[index][1] == "") {
						mandatoryDonorColumnEntries += (", <blank>")
					}
					else {
						mandatoryDonorColumnEntries += (", " + mandatoryDonorColumns[index][1])
					}
					if (jsonObj[0].hasOwnProperty(mandatoryDonorColumns[index][1])) {
						donorFlag = true
						validDonorColumns.push(mandatoryDonorColumns[index])
					}
				}
				if (donorFlag == false) {
					errorString += ("\nOne of the following columns is required" + mandatoryDonorColumnNames + ", but the following entries" + mandatoryDonorColumnEntries + ", are not valid columns in CSV.")
				}
				if (errorString.length > 0) {

					res.json({ status: false, message: errorString, admin: req.session.admin, auction: req.session.auction })
					return
				}
				//The above code is all validations; the below code only runs when all validations are met
				else {
					validOptionalColumns = []
					for (index in optionalColumns) {
						if (jsonObj[0].hasOwnProperty(optionalColumns[index][1])) {
							validOptionalColumns.push(optionalColumns[index])
						}
					}

					result = []
					errorList = ""
					//May need to eventually employ more strict of validations than just saying that it's not empty, or maybe use MongoDB's built-in validations and add to the error list when the MongoDB command fails
					for (var i = 0; i < jsonObj.length; i++) {
						validItem = true
						currentItem = {}
						//If any of the mandatory columns are not filled in, we update validItem to be false
						for (var j = 0; j < mandatoryColumns.length; j++) {
							toAdd = jsonObj[i][mandatoryColumns[j][1]]
							if (toAdd == "") {
								validItem = false
								break
							}
							//Changing string of value to number
							if (mandatoryColumns[j][3] == "number") {
								convertedNumber = parseInt(toAdd)
								if (isNaN(convertedNumber)) {
									validItem = false
									break
								}
								currentItem[mandatoryColumns[j][2]] = convertedNumber
							} else {
								currentItem[mandatoryColumns[j][2]] = toAdd
							}
						}
						donorValid = false
						if (validItem == true) {
							//If at least one required donor column is valid, then the item is still valid
							for (var k = 0; k < validDonorColumns.length; k++) {
								toAdd = jsonObj[i][validDonorColumns[k][1]]
								if (toAdd != "") {
									currentItem[validDonorColumns[k][2]] = toAdd
									donorValid = true
								}
							}
						}
						//If the mandatory and donor requirements are not both met, then we do not need to add anything else to the item
						if (validItem == true && donorValid == true) {
							for (var j = 0; j < validOptionalColumns.length; j++) {
								toAdd = jsonObj[i][validOptionalColumns[j][1]]
								if (toAdd != "") {
									currentItem[validOptionalColumns[j][2]] = toAdd
								}
							}
							currentItem["_auctions"] = req.params.auctions
							Item.create(currentItem, function (err, result) {
								if (err) {
									console.log(err);
								} else {
									// console.log(result)
								}
							});
						} else {
							errorList += "row " + (i + 2) + "\n"
						}
					}
					if (errorList.length > 0) {
						res.json({ status: true, message: "The following rows failed validation::" + errorList, admin: req.session.admin, auction: req.session.auction })
						return
					} else {
						res.json({ status: true, message: "All rows passed validation!", auction: req.session.auction, admin: req.session.admin })
						return
					}
				}
			})
	}


	this.itemsCsv = function (req, res) {
		//May need to add validation checks so that only admins can see
		// console.log("400 items.js this.itemsCsv start")
		// console.log("401 items.js this.itemsCsv.  req.body = ", req.body)
		// console.log("401 items.js this.itemsCsv.  req.body.csvFileName = ", req.body.csvFileName)
		// console.log("401 items.js this.itemsCsv.  req.session = ", req.session)
		// console.log("401 items.js this.itemsCsv.  req.params = ", req.params)


		//NOTE: The below should probably be changed to use any file the organizer specifies in the system, probably by using a file upload module, and then ask for that specification on the populate page
		// const csvFilePath="2019 Gala Auction Item Tracker.csv"

		const path = "./public/";
		const csvFilePath = (path + req.body.csvFileName);

		// console.log("402 items.js this.itemsCsv.  csvFilePath = ",csvFilePath)

		csv()
			.fromFile(csvFilePath)
			.then((jsonObj) => {

				// console.log("403 items.js this.itemsCsv.  jsonObj[0][Item Name] = ", jsonObj[0]["Item Name"])
				// console.log("404 items.js this.itemsCsv.  jsonObj[0] = ", jsonObj[0])
				// console.log("405 items.js this.itemsCsv.  jsonObj = ", jsonObj)
				// console.log("405.1 items.js this.itemsCsv.  jsonObj.length = ", jsonObj.length)


				// This jsonObj is a list of json objects, with each json object having the column name as a key and the entry of the row for that column as its value, illustrated below
				// console.log(jsonObj);
				/**
				* [
				* {a:"1", b:"2", c:"3"},
				* {a:"4", b:"5". c:"6"}
				* ]
				*/

				for (var i = 0; i < jsonObj.length; i++) {

					if (jsonObj[i]) {

						// console.log("405.5 items.js this.itemsCsv pre Item.create.  item in jsonObj[i] = ",jsonObj[i])

						Item.create({
							name: jsonObj[i]["Item Name"],
							description: jsonObj[i]["Item Description"],
							_category: jsonObj[i]["Category"],
							donorPrefix: jsonObj[i]["DonorPrefix"],
							donorFirst: jsonObj[i]["DonorFirst"],
							donorLast: jsonObj[i]["DonorLast"],
							donorOrg: jsonObj[i]["DonorOrg"],
							donorDisplay: jsonObj[i]["DonorDisplay"],
							restrictions: jsonObj[i]["Restrictions"],
							value: jsonObj[i]["Value"],
							packaged: false,
							_auctions: req.session.auction

						}, function (err, item) {
							if (err) {
								// console.log("406 items.js this.itemsCsv Item.create fail.  err = ", err)

							} else {
								// console.log("407 items.js this.itemsCsv Item.create success.  item = ", item)
							}
						});
					}
				}
				// var now = new Date();
				// var start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				// // Item.find({_auctions: req.params.auctions}, function(err, items){
				// Item.find({_auctions: req.session.auction, createdAt: {$gte: start}}, function(err, items){
				// 	if(err){
				// 			console.log(err);
				// 			res.status(500).send('500 items.js this.itemsCsv Item.find.  Failed to find Items');
				// 	}else{
				// 		console.log("502 items.js this.itemsCsv end Item.find.  all items created today = ")
				// 		console.log(items)
				// 	}
				// });

			}).then(res.redirect('/' + req.params.auctions + '/items'));
		// res.redirect('/' + req.params.auctions + '/items')

	}
}

module.exports = new ItemsController();
