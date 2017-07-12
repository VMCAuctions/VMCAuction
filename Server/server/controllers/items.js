console.log('items.js');

var mongoose = require('mongoose');
var Item = require('../models/item.js');



function ItemsController(){
	this.greet = function(req,res){
		// this is our 'hello world' screen
		console.log('Hello, Valley Med');
		res.send('Puttin on the Ritz');
	};

	this.index = function(req,res){
		console.log('ItemsController index');
		Item.find({}, function(err, items) {
    		// This is the method that finds all of the items from the database
	    	if(err) {
	      		console.log('something went wrong from database');
	    	}
	    	else { // else console.log that we did well and then redirect to the root route
	      		console.log('successfully loaded items!');
	      		console.log(items); 
	      		// test screen for items index
	      		// res.send('Items Index Page'); // successful        
	        	
	        	res.json(items);
	        }
        })  // ends Item.find
       
	}; // ends this.index
 
	
	
	this.new = function(req,res){
		console.log('ItemsController new');
	};

	this.create = function(req,res){
		console.log('ItemsController create');
		
    
	    console.log(req.body);
	    Item.create({name: req.body.itemName, description: req.body.itemDescription,
	      category: req.body.category, donor: req.body.donor, restrictions: req.body.itemRestriction, 
	      value: req.body.fairMarketValue},  function(err, result){
	    	// from front end ///////////
	    	//	   itemName: '',
      //           donor: '',
      //           category: '',
      //           fairMarketValue: '',
      //           itemDescription: '',
      //           itemRestriction:

      		// from schema /////////
      		// name:  description:  category:  donor:  restrictions:  value:  photo:  _package: 

	      if(err){
	        console.log('item create-err')
	      }
	      else{
	        res.json(result);
	      }
	    });
	};
  
}
module.exports = new ItemsController(); 