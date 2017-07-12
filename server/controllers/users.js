console.log('users.js');

var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = require('../models/user.js')
var Package = require('../models/package.js');


function UsersController(){
	this.index = function(req,res){
		console.log('UsersController index');
	};
	this.new = function(req,res){
		console.log('UsersController new');
	};
	this.create = function(req,res){
		console.log('UsersController create');
	};
	this.show = function(req,res){
		console.log('UsersController show');
	};

  
}
module.exports = new UsersController(); 