var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
	User = require('../models/user.js'),
	Package = require('../models/package.js'),
	Auction = require('../models/auction.js');

function UsersController(){

	function registrationValidation(input) {
		const validationArray = [
			["firstName", 2, "first name"],
			["lastName", 2, "last name"],
			["streetAddress", 2, "street address"],
			["city", 2, "city"],
			["states", 2, "state"],
			["zip", 5, "zip code"],
			["phoneNumber", 10, "phone number"],
			["password", 6, "password"]
		];
		let output = "";
		for(let i = 0; i < validationArray.length; i++) {
			console.log(validationArray[i]);
			if (input[validationArray[i][0]].length < validationArray[i][1]) {
				output += "Please insert a " + validationArray[i][2] + " that is at least " + validationArray[i][1] + " characters in length.\n";
			}
		}
		return output
	}


	this.index = function(req,res){
		console.log('UsersController index');
		var cart = {}
		User.find({_auctions: req.params.auctions}, function(err, users ){
			if(err){
				console.log(err)
			}else if(req.session.admin){
					Package.find({_auctions: req.params.auctions}, function(err, result){
						if (err){
							console.log(err)
						}else{
							for (var i = 0; i < users.length; i++) {
								var packages = []
								var total = 0
								for (var j = 0; j < result.length; j++) {
									if (result[j].bids[result[j].bids.length-1]){
										if(result[j].bids[result[j].bids.length-1].name===users[i].userName) {
											packages.push(result[j])
											total +=result[j].bids[result[j].bids.length-1].bidAmount
										}
									}
								}
								cart[users[i].userName]={'packages': packages, 'total': total };
							}
							res.render('allUsers', {users :users, cart: cart, packages: result, userName: req.session.userName, admin: req.session.admin, auction: req.params.auctions})
						}
					})
			}else{
				res.redirect('/' + req.params.auctions  + '/packages')
			}
		})
	};

	this.admin = function(req,res){
		console.log('Admin change display');
		User.find({}, function(err, users ){
			if(err){
				console.log(err)
			}else if(req.session.admin){
				res.render('admin', {users :users, userName: req.session.userName, admin: req.session.admin})
			}else{
				res.redirect('/' + req.params.auctions  + '/packages')
			}
		})
	};


	this.login = function(req,res){
		//The registration page will now hold a dropdown menu with all of the active auctions (starttime before today, endtime after today), so that they can select the auction they want to register for; this list of actions will be passed here from a mongo query
		//Auction.find()
		res.render('login', {userName: req.session.userName, admin: req.session.admin, auction:req.session.auction})
	};


	this.register = function(req,res){
		Auction.find({}, function(err, auctions){
			res.render('user', {userName: req.session.userName, admin: req.session.admin, auctions: auctions, auction:req.session.auction})
		})
	};


	this.duplicate = function (req, res) {
		let user = req.query.userName;
		User.findOne({userName: { $regex : new RegExp(user, "i") }}, function (err, duplicate) {
			if(err){
				console.log(err);
			}else if (duplicate) {
				res.json('Username is taken')
			}else {
				res.json('true')
			}
		})
	};


	this.create = function(req,res){

		//Write if statement to check if you are registering as "admin", in which case you should not have an _auctions

		console.log('UsersController create');
		//we are looking for duplicates again incase frontend validation failed is here just in case
		let user = req.body.userName;
		User.findOne({userName: { $regex : new RegExp(user, "i") }}, function (err, duplicate) {
			if(err){
				console.log(err)
			}
			else if(duplicate){
				console.log(duplicate);
			}else{
				//start actual registration
				bcrypt.hash(req.body.password, null, null, function(err, hash) {
						if(err){
							console.log(err)
						}else{
							var validation = registrationValidation(req.body)
							// email regex validation
							var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							var unValidatedEmail = req.body.email;
							var emailResult = unValidatedEmail.match(emailReg);
							if (!emailResult){
								validation += "Invalid email.\n"
							}
							// userName regex validation based on no spaces in userName
							var userReg = /^[a-zA-Z0-9\-_.]{5,25}$/;
							var unValidateduserName = req.body.userName;
							var userResult = unValidateduserName.match(userReg)
							if(!userResult){
								validation += 'Use letters, numbers, and -(dash) or _(underscore) ONLY; between 5-25 characters for userName.\n'
							}
							if(validation.length > 0){
								res.json({validated: false, message: validation})
								return;
							}
							//validation is ok, so hash the password and add to the database
							var lowerUser = req.body.userName.toLowerCase();
							var adminStatus = (lowerUser === "organizer");
							var linkedAuction = req.body.auctions
							if (adminStatus){
								console.log("got in adminStatus")
								linkedAuction = null
							}
							User.create({
								userName: req.body.userName,
								firstName: req.body.firstName,
								lastName: req.body.lastName,
								phone: req.body.phoneNumber,
								email: req.body.email,
								streetAddress: req.body.streetAddress,
								city: req.body.city,
								states: req.body.states,
								zip: req.body.zip,
								_auctions: linkedAuction,
								password: hash,
								admin: adminStatus
							},
							function(err, user){
									if(err){
										console.log(err)
									}else{
										console.log("linkedAuction is", linkedAuction)
										console.log("req.session is", req.session)
										req.session.auction = linkedAuction
										req.session.userName = user.userName
										req.session.admin = user.admin
										console.log("afterwards, req.session is", req.session)
										res.redirect('/' + req.body.auctions + '/packages')
										return;
									}
							});
						}
				});
			}
		})
	};


	this.checkLogin = function(req, res){
		console.log("in check login");
		var name = req.body.userName;
		User.findOne({userName: { $regex : new RegExp(name, "i") }}, function(err, user){
			if(err){
				console.log(err);
			}else if(!user){
				res.json({match: false})
			}else if(user){
				bcrypt.compare(req.body.password, user.password, function(err, match) {
					if(err){
						console.log(err)
					}else if(match){
						req.session.auction = user._auctions
						req.session.userName = user.userName
						req.session.admin = user.admin
						res.json({match: true, auction: user._auction})
					}else{
						res.json({match: false})
					}
				})
			}
		})
	}


	this.show = function(req,res){
		console.log('UsersController show');
		var cartArray = []
		var cartTotal = 0
		Package.find({_auctions: req.params.auctions}, function(err, result){
			if (err){
				console.log(err)
			}else{
				for (var i = 0; i < result.length; i++){
					if (result[i].bids.length > 0){
						if (result[i].bids[result[i].bids.length - 1].name == req.params.userName){
							cartArray.push(result[i])
							cartTotal += result[i].bids[result[i].bids.length - 1].bidAmount
						}
					}
				}
				User.findOne({userName: req.params.userName}).populate("_packages").exec( function(err, user){
					if(err){
						console.log(err)
					}else if (user.userName === req.session.userName | req.session.admin === true){
						res.render('userPage', {userName: req.session.userName, admin: req.session.admin, user: user, cartTotal: cartTotal, cartArray: cartArray, auction: req.params.auctions})
					}else{
						res.redirect('/' + req.params.auctions  + '/packages')
					}
				})
			}
		})
	};

  this.update = function(req,res){
		console.log('UsersController update');
		User.findById(req.params.id ,  function(err, user){
			if (err){
				console.log(err)
			}else {
				//this will eventually allow users and admins to edit their info
			}
		})
	}


	this.adminChange = function(req,res){
		console.log('UsersController admin change')
		//Could potentially update this using a foreach loop and such, although not sure if it would be asychronously correct
		console.log("req.body is", req.body)

		console.log("req.body.keys() is", Object.keys(req.body))

			User.find({_id: Object.keys(req.body)}, function(err, users){
				if (err){
					console.log(err)
				}else{
					for (user in users){
						if (users[user].userName.toLowerCase() != 'admin') {
							users[user].admin = req.body[users[user]._id]
							if(req.body[users[user]._id] === "true"){
								console.log("Got inside if statement")
								users[user]._auctions = null
							}
							users[user].save(function(err, result){
								if (err){
									console.log(err)
								}
							})
						}
					}
					res.redirect('/users/admin')
				}
			})

	};


	this.logout = function(req,res){
		req.session.destroy();
    res.redirect('/users/login')
	};


	this.interested = function(req, res) {
		console.log("Interested");
		User.findOne({userName: req.session.userName}, function(err, user) {
			if (err) {
				console.log(err);
			}else {
				let flag = false
				for (var i = 0; i < user._packages.length; i++) {
					if (user._packages[i] == req.params.id) {
						flag = true;
						break
					}
				}
				if (flag === false) {
					user._packages.push(req.params.id);
					user.save(function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}else{
					flag = false;
				}
			}
			res.redirect('/' + req.params.auctions  + '/packages')
		})
	};


	this.uninterested= function(req,res) {
		console.log("in uniterested");
		User.findOne({userName: req.session.userName}, function(err, user) {
			if (err) {
				console.log(err);
			}else{
				for (var i = 0; i < user._packages.length; i++) {
					if (user._packages[i] == req.params.id) {
						user._packages.splice(i,1)
						user.save(function (err, result) {
							if (err) {
								console.log(err);
							}
						})
						break
					}
				}
			};
			res.redirect('/' + req.params.auctions  + '/packages')
		})
	};


	this.updateList = function(req,res){
		User.findById(req.params.userId,function(err,user){
			if (err){
				console.log(err)
			}else{
				var updatedList = req.params.result.split(',')
				for(let i = 0; i < updatedList.length; i++){
					updatedList[i] = parseInt(updatedList[i])
				}
				user._packages = updatedList
				user.save(function(err,result){
					if(err){
						console.log(err)
					}else{
						console.log(result)
					}
				})
			}
		})
	}

	this.delete = function(req, res){
		User.remove({userName: req.params.user}, function(err, result){
			if (err){
				console.log(err)
			}
			else{
				res.redirect("/users/register")
			}
		})
	}

	this.initialize = function(req, res) {
		bcrypt.hash("password", null, null, function(err, hash) {
			User.create({
				userName: "Organizer",
				firstName: "Julie",
				lastName: "Ott",
				phone: "555-555-5555",
				email: "organizer@gmail.com",
				streetAddress: "555 Organizer Street",
				city: "Sunnyvale",
				states: "CA",
				zip: "55555",
				_auctions: null,
				password: hash,
				admin: true
			})
		})
	}

}

module.exports = new UsersController();
