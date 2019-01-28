var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
	User = require('../models/user.js'),
	Package = require('../models/package.js'),
	Auction = require('../models/auction.js'),
	globals = require('../controllers/globals.js')

function UsersController(){

	function registrationValidation(input) {
		const validationArray = [
			["firstName", 2, "first name"],
			["lastName", 2, "last name"],
			// ["streetAddress", 2, "street address"],
			// ["city", 2, "city"],
			// ["states", 2, "state"],
			// ["zip", 5, "zip code"],
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
		if (globals.clerkValidation(req, res)){
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
								res.render('allUsers', {page: 'supporters', users: users, cart: cart, packages: result, userName: req.session.userName, admin: req.session.admin, auction: req.params.auctions})
							}
						})
				}else{
					res.redirect('/' + req.params.auctions  + '/packages')
				}
			})
		}
	};

	this.admin = function(req,res){
		console.log('Admin change display');
		User.find({}, function(err, users ){
			if(err){
				console.log(err)
			}else if(req.session.admin){
				res.render('admin', {
					users :users,
					userName: req.session.userName,
					admin: req.session.admin
				})
			}else{
				res.redirect('/' + req.params.auctions  + '/packages')
			}
		})
	};


	this.login = function(req,res){
		//The registration page will now hold a dropdown menu with all of the active auctions (starttime before today, endtime after today), so that they can select the auction they want to register for; this list of actions will be passed here from a mongo query
		//Auction.find()
		console.log("users.js this.login 100.  req.session = ",req.session);
		res.render('login', {
			userName: req.session.userName,
			admin: req.session.admin,
			auction:req.session.auction
		})
	};


	this.register = function(req,res){
		Auction.find({}, function(err, auctions){
			res.render('user', {
				userName: req.session.userName,
				admin: req.session.admin,
				auctions: auctions,
				auction:req.session.auction
			})
		})
	};

	//This displays the user account information, as opposed to their watchlist information, which is handled by this.show
	this.showAccount = function(req,res){
		User.findOne({userName: req.params.userName}).exec( function(err, user){
			if(err){
				console.log(err)
			}else if(user.userName === req.session.userName || req.session.admin >= 1){
				Auction.findById(req.params.auctions, function (err, auctionDetails) {
					if (err) {
						console.log(err)
					} else {
						res.render('userAccount', {
							//This should be refactored; there's no reason to send the entire user object and it's parsed elements.  It should just send one or the other.
							user: user,
							firstName: user.firstName,
							lastName: user.lastName,
							userName: user.userName,
							phone: user.phone,
							address: user.streetAddress,
							city: user.city,
							states: user.states,
							zip: user.zip,
							admin: req.session.admin,
							auction: req.params.auctions,
							viewer: req.session.userName,
							auctionDetails: auctionDetails,
						})
					}
				})
			}else{
				res.redirect('/users/login')
			}
		})
	};


	this.duplicate = function (req, res) {
		let user = req.query.userName;
		console.log(req.query)
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


	//Might want to restrict some usernames, such as "organizer/admin or clerk"
	this.create = function(req,res){

		//Write if statement to check if you are registering as "admin", in which case you should not have an _auctions

		console.log('UsersController create');
		console.log(req.body)
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
							var lowerUser = req.body.userName.toLowerCase();
							//In the final product, this will be organizer, but keeping admin for legacy testing.  Also, note that this code isn't being used right now, as admin has an individual create user function run in users.initialize below.
							if (lowerUser === "organizer" || lowerUser === "admin"){
								adminStatus = 2
							}else{
								adminStatus = 0
							}
							// var adminStatus = (lowerUser === "organizer" || lowerUser === "admin");
							var linkedAuction = req.body.auctionName
							if (adminStatus){
								console.log("got in adminStatus")
								linkedAuction = null
							}
							User.create({
								userName: req.body.userName,
								firstName: req.body.firstName,
								lastName: req.body.lastName,
								phone: req.body.phoneNumber,
								// email: req.body.email,
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
										res.redirect('/' + linkedAuction + '/packages')
										return;
									}
							});
						}
				});
			}
		})
	};


	this.checkLogin = function(req, res){
		console.log("users.js checkLogin 100.  req.body = ",req.body);
		
		var name = req.body.userName;
		User.findOne({userName: { $regex : new RegExp(name, "i") }}, function(err, user){
			if(err){
				console.log(err);
			}else if(!user){
				res.json({match: false})
			}else if(user){
				console.log("users.js checkLogin 105.  user = ",user);
				bcrypt.compare(req.body.password, user.password, function(err, match) {
					if(err){
						console.log(err)
					}else if(match){
						console.log("users.js checkLogin 110.  user._auctions", user._auctions)
						req.session.auction = user._auctions
						req.session.userName = user.userName
						req.session.admin = user.admin
						res.json({match: true, auction: user._auctions, admin:user.admin})
					}else{
						res.json({match: false})
					}
				})
			}
		})
	}

	//This displays the user watchlist page, as opposed to their account information, which is handled by this.showAccount; note that admins can bid but this page doesn't currently have a button available to them, so either we should remove admin bidding functionality or include this somehow
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
            Auction.findById(req.params.auctions, function (err, auctionDetails) {
              if (err) {
                console.log(err)
              } else {
                console.log("req.session is", req.session)
                res.render('userPage', {
                  page: 'myAccount',
                  userName: req.session.userName,
                  admin: req.session.admin,
                  user: user,
                  cartTotal: cartTotal,
                  cartArray: cartArray,
                  auction: req.params.auctions,
                  auctionDetails: auctionDetails,
                })
              }
            })
          }else{
            res.redirect('/' + req.params.auctions  + '/packages')
          }
        })
			}
		})
	};


	//function to let organizer change her password. It works but can't login with new password for some reason. Apparently because her old password is hardcoded?
  this.update = function(req,res){
		bcrypt.hash(req.body.newPass, null, null, function(err, hash){
			User.findOneAndUpdate({
				userName: req.session.userName
			}, {
				password: req.body.newPass
			}).then(function(res){
				console.log('changed pass')
			})
		})
	}


	this.adminChange = function(req,res){
		if (globals.adminValidation(req, res)){
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
		}
	};


	this.logout = function(req,res){
		console.log("users.js this.logout 100.  invoking req.session.destroy and redirecting to /users/login")
		req.session.destroy();
    res.redirect('/users/login')
	};


	this.interested = function(req, res) {
		if (globals.notClerkValidation(req, res)){
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
		}
	};


	this.uninterested= function(req,res) {
		console.log("in uninterested");
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
				};
				// 1-17 Bug Fix List Item 16 Set redirect back to user page instead of packages
				// res.redirect('/' + req.params.auctions  + '/packages')
				res.redirect('/' + req.params.auctions  + '/users/' + req.session.userName)
			}
		})
	};


	this.updateList = function(req,res){
		if (globals.notClerkValidation(req, res)){
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
	}

	//I don't think this has been implemented yet
	this.delete = function(req, res){
		if (globals.adminValidation(req, res)){
			User.remove({userName: req.params.user}, function(err, result){
				if (err){
					console.log(err)
				}
				else{
					res.redirect("/users/register")
				}
			})
		}
	}

	this.initialize = function(req, res) {
		bcrypt.hash("password", null, null, function(err, hash) {
			User.create({
				userName: "Organizer",
				firstName: "Julie",
				lastName: "Ott",
				phone: "555-555-5555",
				email: "organizer@gmail.com",
				streetAddress: "123 Main Street",
				city: "Sunnyvale",
				states: "CA",
				zip: "55555",
				_auctions: null,
				password: hash,
				admin: 2
			})
		})
	}

	//This has been moved to global controller
	// this.adminValidation = function(req, res) {
	// 	console.log("inside adminValidation")
	// 	if (req.session.admin != 2){
	// 		res.redirect('/' + req.session.auction + '/packages')
	// 		return false
	// 	}
	// 	return true
	// }

}

module.exports = new UsersController();
