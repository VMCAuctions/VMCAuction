console.log('users.js');

var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose'),
	User = require('../models/user.js'),
	Address = require('../models/address.js'),
	Package = require('../models/package.js');

 // All callbacks in Mongoose use the pattern: callback(error, result). If an error occurs executing the query, 
 // the error parameter will contain an error document, and result will be null. 
 // If the query is successful, the error parameter will be null, and the result will be populated with the results of the query.

function UsersController(){
	// root route get('/')
	this.welcome = function(req,res){
		console.log('UsersController welcome');
	};
	// get all bidders and their packages won, audit page
	this.index = function(req,res){
		console.log('UsersController index');
	};
	// could use this to get the login/registration screen or for the admin to change between bidders
	this.new = function(req,res){
		console.log('UsersController new');
	};
	// post the new user registration form and create a new user
	// TESTING, NOT ENCRYPTING PASSWORD YET ///////////////////////////////////
	this.create = function(req,res){
		console.log('UsersController create');
		User.create({userName: req.body.userName, firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone,
			email: req.body.email, _address: req.body.address, password: req.body.password},  function(err, result){
	    	

	      if(err){
	        console.log('User.create error');
	        
	        res.status(500).send('Failed to Create User');
	      }
	      else{
	        res.json(result);
	      }
	    });
	};

	// TESTING, NOT ENCRYPTING PASSWORD YET ///////////////////////////////////
	this.login = function(req,res){
		console.log('UsersController login');
		User.find({userName: req.body.userName}, function(err, user){
			if(err){
				console.log('User.login error');
				res.status(500).send('User not Found');
			}
			else{
				if(user.password == req.body.password){
					res.json(user);
				}
				else{
					res.status(401).send('Password Validation Failed');
				}
			}
		})
	}
	// get the screen for one user with all his/her bidded packages, noting which packages he/she is currently winning
	this.show = function(req,res){
		console.log('UsersController show');
	};
	this.update = function(req,res){
		console.log('UsersController update');
	}

  
}
module.exports = new UsersController(); 