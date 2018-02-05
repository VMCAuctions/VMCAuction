var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	User = require('../models/user.js');
var ObjectId = require('mongodb').ObjectId;



function PackagesController(){

	this.index = function(req,res){
		console.log('PackagesController index');

		//Joey & Brandon: Currently halting "_bids" populate call, as this will be embedded when db is refactored

		Package.find({}).populate("_items").exec(function(err, packages) {

				// This is the method that finds all of the packages from the database
				if(err) {
						console.log('Package Index Error');
						res.status(500).send('Failed to Load Packages');
				}
				else {
						// res.json({packages: packages, admin:req.session.admin});
						console.log(req.session);
						res.render('packages', {packages: packages})

					}
				})  // ends Package.find

	};


	this.edit = function(req,res){
		var categoryArray = [];
		var itemsArray = [];
		var total = 0;
		Category.find({}, function(err, categories) {
				if(err) {
						console.log(err);
						//res.status(500).send('Failed to Load Items');
				}
				else {
					for(c in categories){
						categoryArray.push(categories[c].name);
					}

		}
		console.log('PackagesController new');
	})
	Item.find({}, function(err, items) {
			// This is the method that finds all of the items from the database
			if(err) {
					console.log(err);
					//res.status(500).send('Failed to Load Items');
			}
			else {
				console.log(total);
				for(let i = 0; i<items.length; i++){
					if(!items[i].packaged){
					itemsArray.push(items[i]);
					console.log(itemsArray);
				}
				}

}
})



		Package.findById(req.params.id).populate("_items").exec(function(err,result){
			if(err){
				console.log(err);
			}
			else{
				let itemValues = result._items;
				 for(let i = 0; i < itemValues.length; i++){
					total += itemValues[i].value;
				 	console.log(result._items[i]);
				 }
				console.log("result is", result)
				res.render('packageEdit', {package: result, categories: categoryArray, items: itemsArray, total: total})
			}
		})
	}


this.new = function(req,res){
	var total = 0;
	var itemsArray = [];
	Item.find({}, function(err, items) {
			// This is the method that finds all of the items from the database
			if(err) {
					console.log(err);
					//res.status(500).send('Failed to Load Items');
			}
			else {
				console.log(total);
				for(item in items){
					itemsArray.push(items[item]);
					console.log(itemsArray);
				}

}
})
		Category.find({}, function(err, categories) {
	    	if(err) {
	      		console.log(err);
	      		//res.status(500).send('Failed to Load Items');
	    	}
	    	else {
					console.log(itemsArray);
					res.render('packageCreate', {categories: categories, total:total, items: itemsArray})
		}
		console.log('PackagesController new');
	})
}

	this.create = function(req,res){
		// this handles the form post that creates a new package
		console.log('PackagesController create');
		console.log(req.body)
	    //////// HOW ARE WE RECEIVING THE INCLUDED ITEMS?  Should be an array of item id's  //////
        /////// When creating Package, do we need to save the bids, seems to be missing in this create statement ////

		if (req.body.selectedItems.length == 0){
          console.log('reached empty item list')
          return res.json(false)
        }


        Package.create({name: req.body.packageName, _items: req.body.selectedItems, description: req.body.packageDescription,
	    	value: req.body.totalValue, bid_increment: req.body.increments, _category: req.body.category,
			bid: [], amount: req.body.openingBid
			},
	    	function(err, package){


		      if(err){
				console.log(err);
				return;
		      }
		      else{

			    	for(var i=0; i<package._items.length; i++){
						console.log("Packaged ");
			    		Item.update({_id: package._items[i]}, { $set: { _package: package._id, packaged: true}}, function(err,result){
							if(err){
								console.log(err);
								return;
							}

						})
						if (i == package._items.length -1){
							return res.json(true)
						}
					};
			    }
			  }
		); // end of Package.create



	};  // end of this.create




	this.show = function(req,res){
		console.log('PackagesController show');
		// sending ID by url or in req.body????????????????
		Package.findById(req.params.id).populate("_items").exec(function(err,result){
			if(err){
				console.log(err);
			}
			else{
				res.json({packages: result});
			}
		})
	};

	this.update = function(req,res){
		console.log('PackagesController update');
		Package.findById(req.params.id, function (err, package) {
			console.log(package);
		    if (err) {
		        res.status(500).send(err);
		    }

		    else {
				console.log("update pacakge");
		        // Update each attribute with any possible attribute that may have been submitted in the body of the request
		        // If that attribute isn't in the request body, default back to whatever it was before.
		        package.name = req.body.packageName || package.name;

		        package.description = req.body.packageDescription || package.description;
		        package.bids[0] = req.body.openingBid || package.bids[0];
		        package.value = req.body.totalValue || package.value;
		        package.bid_increment = req.body.increments || package.bid_increment;
		        package._category = req.body.category || package._category;

		        // we don't want the items removed from this package to still show this package in their
				// item._package field so we will just set each current item._package to null
				// this shows sets all items in current package to unpackaged (currently)
				// we want all items in this package AND all unpacked items (future design)
				package._items = req.body.selectedItems;
		        // for(var i=0; i<package._items.length; i++){
				// 	console.log("Packaged ");
				// 	Item.update({_id: package._items[i]}, { $set: { _package: package._id, packaged: true}}, function(err,result){
				// 		if(err){
				// 			console.log(err);
				// 			return;
				// 		}

				// 	})
				// 	if (i == package._items.length -1){
				// 		return res.json(true)
				// 	}
				// };
		        // now set package._items to the items in this request, we will reset the appropriate item._package fields below



		        // Save the updated document back to the database
				console.log("before package save");
		        package.save(function (err, package) {
					console.log("Package save")
		            if (err) {
                        console.log(err)
		                //res.status(500).send(err)
		            }
		            else{
		            	// update the items in this package
						console.log("save update pacakge")
		    					for(let i = 0; i < package._items.length; i++ ){
									//Item.update({_id: id}, { $set: { _package: package.id}});

									Item.findOne({_id: package._items[i]} , function(err, item){
											item.packaged = true;
											item._package = package.id;

											item.save(function (err){
												if (err){
													console.log(err)
												}
												else{


												}
											})
									})




		    					}

		            	res.json(package);
		            }
		        });
		    }
		});
	}  // end of this.update();

	this.get_selected = function(req, res){
		Package.find({_category:req.body.category}, function(err, result){
			if(err){
				console.log(err)
			}else{
				res.json(result)
			}
		})
	},

	//removing a package from the DB
	this.remove_package = function(req, res){
		Package.findOne({_id: req.body.package_id}, function(err, result){
			if(err){
				console.log(err)
			}else{
				for(var i = 0; i < result._items.length; i++){
					Item.update({_id: result._items[i]}, {$set: {packaged: false, _package: null}}, function(err, result){
						if(err){
							console.log(err)
						}
					});
				}
				Package.remove({_id: req.body.package_id}, function(err, result){
					if(err){
						console.log(err)
					}else{
						res.json(result);
					}
				})
			}

		})

	}

	// Item.update({_id: package._items[i]}, { $set: { _package: package._id, packaged: true}}

}


module.exports = new PackagesController();
