var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Category = require('../models/category.js');
	Package = require('../models/package.js');

function ItemsController(){

	this.index = function(req,res){
		console.log('ItemsController index');
		var packages;
		var categories;
		Package.find({}, function (err, result) {
			if (err) {
				console.log(err);
			}else {
				packages = result;
			}
		})
		Category.find({}, function (err, result) {
			if (err) {
				console.log(err);
			}else{
				categories = result
			}
		})
		Item.find({}).populate("_package").sort({_category:'ascending'}).exec(function(err, items){
	    	if(err){
	      		console.log(err);
	      		res.status(500).send('Failed to Load Items');
	    	}else{
					res.render('items', {items: items, admin: req.session.admin, userName: req.session.userName, packages: packages, categories: categories})
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
						res.render('createItem', {categories: categories, userName: req.session.userName, admin: req.session.admin})
					}else{
						res.redirect('/packages')
					}
				}
		console.log('ItemsController new');
		});
	}
	this.create = function(req,res){
		console.log('ItemsController create');
		//Need to link the current auction to the item upon creation
		//_auctions: ...
    Item.create({name: req.body.itemName, description: req.body.itemDescription,
      _category: req.body.category, donor: req.body.donor, restrictions: req.body.itemRestriction,
      value: req.body.fairMarketValue, packaged: false, priority: req.body.priority},  function(err, result){
      if(err){
        console.log(err);
        res.status(500).send('Failed to Create Item');
      }else{
        res.redirect('/items/new?true')
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
						res.render('itemEdit', {item:result, categories:categories, userName: req.session.userName, admin: req.session.admin});
					}else{
						res.redirect('/packages')
					}
				})
		  }
		})
	}


	this.update = function(req,res){
		console.log('ItemsController update');
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
	        item.donor = req.body.donor || item.donor;
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
							res.redirect('/items')
          });
	    }
	  });
	}


	this.removeItem = function(req, res){
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
							}else {
								package.value -= val;
								package.save(function (err, result) {
									if (err) {
										console.error();
									}
								})
							}
						})
						res.redirect('/items')
					}
				})
			}
		})
	}

}

module.exports = new ItemsController();
