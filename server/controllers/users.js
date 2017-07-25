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
	this.create = function(req,res){
		console.log('UsersController create');
	};
	// get the screen for one user with all his/her bidded packages, noting which packages he/she is currently winning
	this.show = function(req,res){
		console.log('UsersController show');
	};
	this.update = function(req,res){
		console.log('UsersController update');
	}

  
}
module.exports = new UsersController(); 