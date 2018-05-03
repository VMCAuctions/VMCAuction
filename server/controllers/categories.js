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

}

module.exports = new CategoriesController();
