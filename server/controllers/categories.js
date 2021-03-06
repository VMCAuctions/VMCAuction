var mongoose = require('mongoose'),
	Category = require('../models/category.js'),
	globals = require('../controllers/globals.js')


function CategoriesController(){

	// this.index = function(req,res){
	// 	console.log('CategoriesController index');
	// 	if (globals.adminValidation(req, res)){
	// 		Category.find({}, function(err, categories) {
	// 	    	if(err) {
	// 	      	console.log(err);
	// 	    	// }
	// 	    	// else if(req.session.admin) {				
	// 				// 		if (err) {
	// 				// 			console.log(err)
	// 				} else {
	// 							//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page	
	// 							Auction.findById(req.params.auctions, function (err, auctionDetails) {
	// 							console.log('categories.js render categories');
	// 								res.render('categories', {
	// 									admin: req.session.admin,
	// 									categories: categories,
	// 									userName: req.session.userName,
	// 									auction: req.params.auctions,
	// 									auctionDetails: auctionDetails,
	// 								});	
	// 							})	
	// 						}
	// 				// } else {
	// 				// 		res.redirect('/' + req.params.auctions + '/packages');
	// 				})			
				
	// 		}
	// 	};		
		
	this.index = function(req,res){
		console.log('CategoriesController index');
		if (globals.adminValidation(req, res)){
			Category.find({}, function(err, categories) {
				if(err) {
					console.log(err);	
				}else{
					res.render('categories', {
						categories: categories,
						admin: req.session.admin,
						userName: req.session.userName,
					});	
				}
			})
		}
	};				

	this.create = function(req,res){
		console.log('CategoriesController create');
		if (globals.adminValidation(req, res)){
		  Category.create({name: req.body.name},  function(err, result){
		      if(err){
		        console.log(err);
		      }else{
				  console.log('categories.js cat.create')
							// res.redirect('/' + req.params.auctions + '/categories?true');
							res.redirect('/categories');
		      }
	    })
		}
	}

	this.delete = function(req, res){

		if (globals.adminValidation(req, res)){
		  Category.remove({_id: req.params._id},  function(err, result){
		    if(err){
		        console.log(err);
		    }else{
				console.log('categories.js cat.delete')
		    }
				// res.redirect('/' + req.params.auctions + '/categories?true');
				res.redirect('/categories');
	    })
		}
	}

	 //Checks if the auction's categories are empty
	 this.checkIfEmpty = function(){
		 console.log("entered checkIfEmpty")
		 Category.find({}, function(err, result){
			 if (err){
				 console.log(err)
			 }
			 else if (result.length === 0){
				 console.log("should return true", result.length === 0)
				 return true
			 }
			 else{
				 console.log("should return false", result.length === 0)
				 return false
			 }
		 })
	 }

	 //This will be used to hardcode in the categories for Valley Medical upon auction creation
	 this.initialize = function(){
		 console.log('CategoriesController initialize');
		 const categoryArray = ["Travel/Vacations", "Food & Drink", "Sports", "Art", "Activities", "Lifestyle", "Specialty Items"]
		 for (var i = 0; i < categoryArray.length; i++) {
			 Category.create({name: categoryArray[i]},  function(err, result){
			 	 if(err){
			 		 console.log(err);
				 }
		 	 })
		 }
	 }

};

module.exports = new CategoriesController();
