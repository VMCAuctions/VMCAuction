var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Category = require('../models/category.js'),
	Package = require('../models/package.js'),
	Auction = require('../models/auction.js');
	globals = require('../controllers/globals.js')
const csv=require('csvtojson')

function ItemsController(){

	this.index = function(req,res){
		console.log('ItemsController index');
		Category.find({}, function (err, categories) {
			if (err) {
				console.log(err);
			}else{
				Item.find({_auctions: req.params.auctions}).populate("_package").sort({_category:'ascending'}).exec(function(err, items){
						if(err){
								console.log(err);
								res.status(500).send('Failed to Load Items');
						}else{
							res.render('items', {
								page:'items',
								items: items,
								admin: req.session.admin,
								userName: req.session.userName,
								categories: categories,
								auction: req.params.auctions
							})
						}
				})
			}
		})
	};


	this.new = function(req,res){
		Category.find({}, function(err, categories) {
    	if(err) {
      		console.log(err);
      		res.status(500).send('Failed to Load Items');
    	}else{
				if(req.session.admin){
					res.render('createItem', {
						page:'addItem',
						categories: categories,
						userName: req.session.userName,
						admin: req.session.admin,
						auction: req.params.auctions
					})
				}else{
					res.redirect('/' + req.params.auctions + '/packages')
				}
			console.log('ItemsController new');
			};
		})
	}
	this.create = function(req,res){
		console.log('ItemsController create');
		console.log("donor display:", req.body.donorAnonymous);
		let donorDisplay = "Anonymous";
		if (!req.body.donorAnonymous) {
			if (req.body.donorOrg ) {
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
		},  function(err, result){
      if(err){
        console.log(err);
        res.status(500).send('Failed to Create Item');
      }else{
        res.redirect('/' + req.params.auctions + '/items/new?true')
      }
    });
	};


	this.edit = function(req,res){
		console.log('ItemsController edit');
		Item.findById(req.params.id, function(err, result){
			if(err){
	        console.log(err);
	     }else{
				Category.find({}, function(err, categories) {
					if(err) {
					  console.log(err);
					  res.status(500).send('Failed to Load Items');
					}else if(req.session.admin){
						res.render('itemEdit', {
							item:result,
							categories:categories,
							userName: req.session.userName,
							admin: req.session.admin,
							auction: req.params.auctions
						});
					}else{
						res.redirect('/' + req.params.auctions + '/packages')
					}
				})
		  }
		})
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
				item.donorPrefix = req.body.donorPrefix || item.donorPrefix;
		        item.donorFirst = req.body.donorFirst || item.donorFirst;
				item.donorLast = req.body.donorLast || item.donorLast;
				item.donorOrg  = req.body.donorOrg || item.donorOrg;
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
		console.log("reached this.populate")

		//NOTE: The below should probably be changed to use any file the organizer specifies in the system, probably by using a file upload module, and then ask for that specification on the populate page
		const csvFilePath="2018 Gala Auction Item Tracker - 2018 Auction Item Tracker.csv"

		csv()
		.fromFile(csvFilePath)
		.then((jsonObj)=>{
				// This jsonObj is a list of json objects, with each json object having the column name as a key and the entry of the row for that column as its value, illustrated below
		    // console.log(jsonObj);
		    /**
		     * [
		     * 	{a:"1", b:"2", c:"3"},
		     * 	{a:"4", b:"5". c:"6"}
		     * ]
		     */

				 console.log("req.body", req.body)

				 mandatoryColumns = [
					 ["Item Name", req.body.itemNameColumn, "name", null],
					 ["Item Description", req.body.itemDescriptionColumn, "description", null],
					 ["Fair Market Value", req.body.itemValueColumn, "value", "number"],
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
		     for (index in mandatoryColumns){
		       if (!jsonObj[0].hasOwnProperty(mandatoryColumns[index][1])){
						 if (mandatoryColumns[index][1] == ""){
							 errorString += ("\n" + mandatoryColumns[index][0] + " is a required field, but no value was specified.")
						 }
						 else{
	 		         errorString += ("\n" + mandatoryColumns[index][0] + " is required, but the specified column, " + mandatoryColumns[index][1] + ", is not a valid column in CSV.")
						 }
		       }
		     }
				 validDonorColumns = []
				 donorFlag = false
				 mandatoryDonorColumnNames = ""
				 mandatoryDonorColumnEntries = ""
				 for (index in mandatoryDonorColumns){
					 mandatoryDonorColumnNames += (", " + mandatoryDonorColumns[index][0])
					 if (mandatoryDonorColumns[index][1] == ""){
						 mandatoryDonorColumnEntries += (", <blank>")
					 }
					 else{
	 					 mandatoryDonorColumnEntries += (", " + mandatoryDonorColumns[index][1])
					 }
					 if (jsonObj[0].hasOwnProperty(mandatoryDonorColumns[index][1])){
						 donorFlag = true
						 validDonorColumns.push(mandatoryDonorColumns[index])
					 }
				 }
				 if (donorFlag == false){
					 errorString += ("\nOne of the following columns is required" + mandatoryDonorColumnNames + ", but the following entries" + mandatoryDonorColumnEntries + ", are not valid columns in CSV.")
				 }
		     if (errorString.length > 0){
					 res.json({status:false, message:errorString, admin: req.session.admin, auction: req.session.auction})
					 return
		     }
				 //The above code is all validations; the below code only runs when all validations are met
		     else{
					 validOptionalColumns = []
					 for (index in optionalColumns){
						 if (jsonObj[0].hasOwnProperty(optionalColumns[index][1])){
							 validOptionalColumns.push(optionalColumns[index])
						 }
					 }

		       result = []
		       errorList = ""
					 //May need to eventually employ more strict of validations than just saying that it's not empty, or maybe use MongoDB's built-in validations and add to the error list when the MongoDB command fails
		       for (var i = 0; i < jsonObj.length; i++){
		         validItem = true
		         currentItem = {}
						 //If any of the mandatory columns are not filled in, we update validItem to be false
		         for (var j = 0; j < mandatoryColumns.length; j++){
		           toAdd = jsonObj[i][mandatoryColumns[j][1]]
		           if (toAdd == ""){
		             validItem = false
		             break
		           }
		           //Changing string of value to number
		           if (mandatoryColumns[j][3] == "number"){
		             convertedNumber = parseInt(toAdd)
		             if (isNaN(convertedNumber)){
		               validItem = false
		               break
		             }
		             currentItem[mandatoryColumns[j][2]] = convertedNumber
		           }
		           else{
		             currentItem[mandatoryColumns[j][2]] = toAdd
		           }
		         }
						 donorValid = false
						 if (validItem == true){
							 //If at least one required donor column is valid, then the item is still valid
							 for (var k = 0; k < validDonorColumns.length; k++){
								 toAdd = jsonObj[i][validDonorColumns[k][1]]
								 if (toAdd != ""){
									 currentItem[validDonorColumns[k][2]] = toAdd
									 donorValid = true
								 }
							 }
						 }
						 //If the mandatory and donor requirements are not both met, then we do not need to add anything else to the item
						 if (validItem == true && donorValid == true){
							 for (var j = 0; j < validOptionalColumns.length; j++){
								 toAdd = jsonObj[i][validOptionalColumns[j][1]]
								 if (toAdd != ""){
									 currentItem[validOptionalColumns[j][2]] = toAdd
								 }
							 }
							 currentItem["_auctions"] = req.params.auctions
							 Item.create(currentItem,  function(err, result){
								 if(err){
									 console.log(err);
								 }else{
									 // console.log(result)
								 }
							 });
						 }
		         else{
		           errorList += "row " + (i + 2) + "\n"
		         }
		       }
		       if (errorList.length > 0){
						 res.json({status:true, message:"The following rows failed validation:\n" + errorList, admin: req.session.admin, auction: req.session.auction})
						 return
		       }
					 else{
						 res.json({status:true, message:"All rows passed validation!", auction: req.session.auction, admin: req.session.admin})
						 return
					 }
		     }
		})
	}
}

module.exports = new ItemsController();
