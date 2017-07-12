console.log('packages.js');

var mongoose = require('mongoose');
var Item = require('../models/item.js');
var Package = require('../models/package.js');


function PackagesController(){
	
	this.index = function(req,res){
		console.log('PackagesController index');
	};
	this.new = function(req,res){
		console.log('PackagesController new');
	};
	this.create = function(req,res){
		console.log('PackagesController create');
	};
	this.show = function(req,res){
		console.log('PackagesController show');
	};

  
}
module.exports = new PackagesController(); 