var mongoose = require('mongoose'),
	Category = require('../models/category.js');


function CategoriesController(){

	this.index = function(req,res){
		console.log('CategoriesController index');
		Category.find({}, function(err, categories) {
	    	if(err) {
	      		console.log(err);
	    	}
	    	else if(req.session.admin) {
	        	res.render('categories', {admin: req.session.admin, categories: categories, userName: req.session.userName, auction: req.params.auctions});
	      }else{
					res.redirect('/' + req.params.auctions + '/packages')
				}
      })
	};

	this.create = function(req,res){
		console.log('CategoriesController create');
	  Category.create({name: req.body.name},  function(err, result){
	      if(err){
	        console.log(err);
	      }else{
	        	res.redirect('/' + req.params.auctions + '/categories?true');
	      }
    })
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
		 Category.create({name: "Travel/Vacations"},  function(err, result){
				 if(err){
					 console.log(err);
				 }else{
					 Category.create({name: "Food & Drink"},  function(err, result){
							 if(err){
								 console.log(err);
							 }else{
								 Category.create({name: "Sports"},  function(err, result){
										 if(err){
											 console.log(err);
										 }else{
											 Category.create({name: "Art"},  function(err, result){
													 if(err){
														 console.log(err);
													 }else{
														 Category.create({name: "Activities"},  function(err, result){
																 if(err){
																	 console.log(err);
																 }else{
																	 Category.create({name: "Lifestyle"},  function(err, result){
																			 if(err){
																				 console.log(err);
																			 }else{
																				 Category.create({name: "Specialty Items"},  function(err, result){
																						 if(err){
																							 console.log(err);
																						 }else{
																							 Category.find({}, function(err, categories){
																								 if (err){
																									 console.log(err)
																								 }
																								 else{
																									 console.log(categories)
																									 return
																								 }
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
									})
							 }
						})
				 }
			})
		}

}

module.exports = new CategoriesController();
