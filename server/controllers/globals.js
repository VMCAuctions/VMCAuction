var mongoose = require('mongoose'),
	Global = require('../models/global.js');

console.log("reached globals.js")

function GlobalsController(){
	this.initialize = function(req, res){
		pins = []
		for (var i = 1000; i <= 9999; i++){
		//Note: As mongoose can't hold Python sets, and these are going to be deleted frequently, we are using a map due to its indexing type even though the "value" part is just dummy data
		pins.push(String(i))
		}
		Global.create({pins: pins}, function(err, result){
		if(err){
			console.log(err)
		}
		})
	}
	this.adminValidation = function(req, res) {
		
		if (req.session.admin != 2){

			// //IMPORTANT - this code prevents being kicked out due to session.admin / session.auction = undefined errors
			// //REMOVE FOR PRODUCTION!!

			// req.session.admin = "2";
			// req.session.auction = "5beda68d6555a93bbc62ba32";

			// console.log("globals.js adminVal.  hard coded session data = req.ses.admin = ",req.session.admin," req.ses = ",req.session)

			// return true

			// //END

			//Redirect to the event landing page
			res.redirect('/' + req.session.auction + '/event')
			return false
		}
		return true
	}
	this.clerkValidation = function(req, res) {
		if (req.session.admin == 0){
			res.redirect('/' + req.session.auction + '/event')
			return false
		}
		return true
	}
	this.notClerkValidation = function(req, res) {
		if (req.session.admin == 1){
			res.redirect('/' + req.session.auction + '/event')
			return false
		}
		return true
	}	

}

module.exports = new GlobalsController();
