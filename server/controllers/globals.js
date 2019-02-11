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
		console.log("100 globals.js this.adminValidation. req.ses.admin = ",req.session.admin," req.ses = ",req.session)
		if (req.session.admin != 2){

			// //IMPORTANT - this code prevents being kicked out due to session.admin / session.auction = undefined errors
			// //REMOVE FOR PRODUCTION!!

			req.session.admin = "2";
			// auction name = 'Getting the gold
			req.session.auction._id = "5c59f82b181b703674c1eca5";
			req.session.urlStub = 'getting-the-gold'

			console.log("102 globals.js adminVal.  hard coded session data = req.ses.admin = ",req.session.admin," req.ses = ",req.session)

			return true

			// //END

			// res.redirect('/' + req.session.auction + '/packages')
			// return false
		}
		return true
	}
	this.clerkValidation = function(req, res) {
		if (req.session.admin == 0){
			res.redirect('/' + req.session.auction + '/packages')
			return false
		}
		return true
	}
	this.notClerkValidation = function(req, res) {
		if (req.session.admin == 1){
			res.redirect('/' + req.session.auction + '/packages')
			return false
		}
		return true
	}	

}

module.exports = new GlobalsController();
