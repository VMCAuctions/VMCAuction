console.log('packages.js');

var mongoose = require('mongoose'),
	Item = require('../models/item.js'),
	Package = require('../models/package.js'),
	Category = require('../models/category.js'),
	Bid = require('../models/bid.js'),
	User = require('../models/user.js');


function PackagesController(){
	
	this.index = function(req,res){
		console.log('PackagesController index');
		Package.find({}, function(err, packages) {
    		// This is the method that finds all of the packages from the database
	    	if(err) {
	      		console.log('something went wrong from database');
	    	}
	    	else { 
	      		console.log('successfully loaded packages!');
	      		console.log(packages); 
	      		        
	        	
	        	res.json(packages);
	        }
        })  // ends Package.find
	};


	this.new = function(req,res){
		// this would be the method that gets the new package form but this is probably handled independently by React
		console.log('PackagesController new');
	};


	this.create = function(req,res){
		// this handles the form post that creates a new package
		console.log('PackagesController create');

    	
	    //////// HOW ARE WE RECEIVING THE INCLUDED ITEMS?  Should be an array of item id's  //////
	    Package.create({name: req.body.packageName, _items: req.body.selectedItems, description: req.body.packageDescription,
	    	value: req.body.totalValue, bid_increment: req.body.increments, _category: req.body.category},  
	    	function(err, package){
  

		      if(err){
		        console.log('package create-err');
				console.log(err);
		      }
		      else{
		      	// currently setting package._bids[0] to be the opening bid with no user associated with it
	    		Bid.create({amount: req.body.openingBid, _package: package.id}, function(err, bid){
	    			if(err){
		        		console.log('bid create-err');
		      		}
		      		else{
		        		package._bids.push(bid.id);
		      		}
		    	}); // end of Bid.create()
		    	
		    	


		    	// update the items in this package to reflect item._package = this package we're creating
		    	for(id in package._items){
		    		Item.update({_id: id}, { $set: { _package: package.id}}, function(err,result){
						if(err){
							console.log(err);
						}
					});
		    		// example from mongoose.js docs
		    		//Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);
		    	}
		    	res.json(package);
			  }
			}
		);

	    	    
	    
	};  // end of .create




	this.show = function(req,res){
		console.log('PackagesController show');
		// sending ID by url or in req.body????????????????
		Package.findById(req.params.id, function(err,result){
			if(err){
				console.log(err);
			}
			else{
				res.json(result);
			}
		})
	};

	this.update = function(req,res){
		console.log('PackagesController update');
		Package.findById(req.params.id, function (err, package) {  
    		
		    if (err) {
		        res.status(500).send(err);
		    } 
		    else {
		        // Update each attribute with any possible attribute that may have been submitted in the body of the request
		        // If that attribute isn't in the request body, default back to whatever it was before.
		        package.name = req.body.packageName || package.name;
		        
		        package.description = req.body.packageDescription || package.description;
		        package._bids[0] = req.body.openingBid || package._bids[0];
		        package.value = req.body.fairMarketValue || package.value;
		        package.bid_increment = req.body.increments || package.bid_increment;
		        package._category = req.body.category || package._category;

		        // we don't want the items removed from this package to still show this package in their 
		        // item._package field so we will just set each current item._package to null 
		        for(id in package._items){
		        	Item.update({_id: id}, { $set: { _package: null}}, callback);
		        }
		        // now set package._items to the items in this request, we will reset the appropriate item._package fields below
		        package._items = req.body.items;

	            
		        // Save the updated document back to the database
		        package.save(function (err, package) {
		            if (err) {
		                res.status(500).send(err)
		            }
		            else{
		            	// update the items in this package
		    			for(id in package._items){
		    				Item.update({_id: id}, { $set: { _package: package.id}}, callback);
		    			}

		            	res.json(package);
		            }
		        });
		    }
		});
	}  // end of this.update();

  
}


module.exports = new PackagesController(); 