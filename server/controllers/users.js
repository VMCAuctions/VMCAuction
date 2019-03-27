var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
	User = require('../models/user.js'),
	Package = require('../models/package.js'),
	Auction = require('../models/auction.js'),
	globals = require('../controllers/globals.js')
const csv=require('csvtojson')

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
			// console.log(Date.now()," - 000 users.js registrationValidation.  validationArray[i] = ",validationArray[i]);
			if (input[validationArray[i][0]].length < validationArray[i][1]) {
				output += "Please insert a " + validationArray[i][2] + " that is at least " + validationArray[i][1] + " characters in length.\n";
			}
		}
		return output
	}


	this.index = function(req,res){
		// console.log(Date.now()," - 010 users.js this.index.  UsersController index");
		// console.log("011 users.js this.index.  req.session = ", req.session)
		// console.log(globals.clerkValidation(req, res));
		if (globals.clerkValidation(req, res)){
			var cart = {}
			User.find({_auctions: req.params.auctions}, function(err, users ){
			// User.find({}, function(err, users ){
				if(err){
					console.log(err)
				}else if(req.session.admin){
						// console.log("012 users.js this.index User.find.  users = ",users);
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
								//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
									} else {	
										//current is a flag showing which page is active
										res.render('allUsers', {
											current: 'supporters', 
											users: users, 
											cart: cart, 
											packages: result, 
											userName: req.session.userName, 
											admin: req.session.admin, 
											auction: req.params.auctions,
											auctionDetails: auctionDetails
										})		
									}
								})
							}	
						})	
				}else{
					//If no known user, redirect to the event landing page 
					res.redirect('/' + req.params.auctions  + '/event');
				}
		  })
		}
	};

	this.admin = function(req,res){
		// console.log("020 users.js this.admin  Admin change display");
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
				res.redirect('/' + req.params.auctions  + '/event')
			}
		})
	};


	this.login = function(req,res){
		//The registration page will now hold a dropdown menu with all of the active auctions (starttime before today, endtime after today), so that they can select the auction they want to register for; this list of actions will be passed here from a mongo query
		//Auction.find()
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
				// console.log("100 users.js this.showAccount User.findOne.  user = ",user)
				Auction.findById(req.params.auctions, function (err, auctionDetails) {
					if (err) {
						console.log(err)
					} else {
						res.render('userAccount', {
							//This should be refactored; there's no reason to send the entire user object and it's parsed elements.  It should just send one or the other.
							//current is a flag showing which page is active
							current: 'myAccount',
							user: user,
							userName: user.userName,
							// firstName: user.firstName,
							// lastName: user.lastName,
							// phone: user.phone,
							// address: user.streetAddress,
							// city: user.city,
							// states: user.states,
							// zip: user.zip,
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
		// console.log(req.query)
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

		// console.log(Date.now()," - 030 users.js this.create start");
		console.log(req.body)
		//we are looking for duplicates again incase frontend validation failed is here just in case
		let user = req.body.userName;
		User.findOne({userName: { $regex : new RegExp(user, "i") }}, function (err, duplicate) {
			if(err){
				console.log(err)
			}
			else if(duplicate){
				// console.log(duplicate);
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
								// console.log("got in adminStatus")
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
										// console.log("linkedAuction is", linkedAuction)
										// console.log("req.session is", req.session)
										req.session.auction = linkedAuction
										req.session.userName = user.userName
										req.session.admin = user.admin
										// console.log("afterwards, req.session is", req.session)
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
		console.log("in check login");
		var name = req.body.userName;
		// console.log(Date.now(),"000 users.js checkLogin.  r.b.userName = ",req.body.userName)
		User.findOne({userName: { $regex : new RegExp(name, "i") }}, function(err, user){
			if(err){
				// console.log("001 users.js checkLogin.  err = ",err);

			}else if(!user){
				// console.log("002 users.js checkLogin.  !user block");
				res.json({match: false})
			}else if(user){
				// console.log(Date.now(),"004 users.js checkLogin.  user = ",user)
				bcrypt.compare(req.body.password, user.password, function(err, match) {
				// console.log(Date.now(),"004 users.js checkLogin.  match = ",match)
					if(err){
						console.log(err)
					}else if(match){
						// console.log("user._auctions", user._auctions)
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
		// console.log('UsersController show');
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
                // console.log("req.session is", req.session)
                res.render('userPage', {
                  current: 'watch-list',
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
            res.redirect('/' + req.params.auctions  + '/event')
          }
        })
			}
		})
	};



	this.update = function(req,res){
		// console.log("400 users.js this.update start.  req.body = ",req.body)
		// console.log("400 users.js this.update start.  req.params = ",req.params)
		User.findOne({userName: req.body.userName}, function(err, user) {
			if (err) {
				console.log(err);
			} else {
				// console.log("410 users.js this.update User.findOne.  user = ",user)
				user.firstName = req.body.firstName;
				user.lastName = req.body.lastName;
				user.streetAddress = req.body.address;
				user.city = req.body.city;
				user.states = req.body.states;
				user.zip = req.body.zip;
				user._auctions = req.params.auctions;
				user.save()
			}
		})
		.then(res.redirect("/" + req.params.auctions + "/users/account/" + req.body.userName))
	};

	this.supporterCsv = function(req, res){
		//May need to add validation checks so that only admins can see
		// console.log("310 items.js this.populateCsv start")
		Auction.findById(req.params.auctions, function (err, auctionDetails) {
			if (err) {
				console.log(err)
			} else {
				// console.log("311 items.js this.populateCsv.  r.s.admin = ",req.session.admin," r.p.auctions = ",req.params.auctions)
				res.render('csvUpload-supporters', {admin: req.session.admin, userName: req.session.userName, auction: req.params.auctions, auctionDetails: auctionDetails, filename: req.body.supporterCsvUpload})
			}
		})
	};

	// Import new users from .csv file (stored in /public)
	this.usersCsv = function(req, res){
		//May need to add validation checks so that only admins can see
		// console.log("400 users.js this.usersCsv start")
		// console.log("400 users.js this.usersCsv.  req.body = ", req.body)
		// console.log("401 users.js this.usersCsv.  req.body = ", req.body.csvFileName)
		// console.log("402 users.js this.usersCsv.  req.body.supporterCsvUpload = ", req.body.supporterCsvUpload)
		// console.log("403 users.js this.usersCsv.  req.session = ", req.session)
		// console.log("404 users.js this.usersCsv.  req.params = ", req.params)
		
		// NOTE: MUST CHANGE PATH TO YOUR PATH TO '/public' ON YOUR LOCAL DRIVE 
		const path = "C:/AA_local_Code/MEAN/aa_vmc/VMCAuction/public/";

		const csvFilePath=(path + req.body.csvFileName);
		
		// console.log("402 users.js this.usersCsv.  csvFilePath = ",csvFilePath)

		csv()
		.fromFile(csvFilePath)
		.then((jsonObj)=>{
			
			// console.log("403 users.js this.usersCsv.  jsonObj[0][User Name] = ", jsonObj[0]["User Name"])
			// console.log("404 users.js this.usersCsv.  jsonObj[0] = ", jsonObj[0])
			// console.log("405 users.js this.usersCsv.  jsonObj = ", jsonObj)
			// console.log("405.1 users.js this.usersCsv.  jsonObj.length = ", jsonObj.length)

			for (var i = 0; i < jsonObj.length; i++){

				if (jsonObj[i]){

					// console.log("405.5 users.js this.usersCsv pre User.create.  user in jsonObj[i] = ",jsonObj[i])

					User.create({
						userName: jsonObj[i]["User Name"],
						firstName: jsonObj[i]["First Name"],
						lastName: jsonObj[i]["Last Name"],
						phone: jsonObj[i]["Phone"],
						streetAddress: jsonObj[i]["Street"],
						city: jsonObj[i]["City"],
						states: jsonObj[i]["State"],
						zip: jsonObj[i]["Zip"],
						admin: jsonObj[i]["Admin"],
						_auctions: req.params.auctions
						
						
					}, function(err, user){
						if(err){
							console.log("406 users.js this.usersCsv User.create fail.  err = ",err)
							
						}else{
							console.log("407 users.js this.usersCsv User.create success.  ")
						}
					});
				}
			}
			
		}).then(res.redirect('/' + req.params.auctions + '/users'));
	}

	this.adminChange = function(req,res){
		if (globals.adminValidation(req, res)){
			// console.log('UsersController admin change')
			//Could potentially update this using a foreach loop and such, although not sure if it would be asychronously correct
			// console.log("req.body is", req.body)

			// console.log("req.body.keys() is", Object.keys(req.body))

			User.find({_id: Object.keys(req.body)}, function(err, users){
				if (err){
					console.log(err)
				}else{
					for (user in users){
						if (users[user].userName.toLowerCase() != 'admin') {
							users[user].admin = req.body[users[user]._id]
							if(req.body[users[user]._id] === "true"){
								// console.log("Got inside if statement")
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
		req.session.destroy();
    res.redirect('/users/login')
	};


	this.interested = function(req, res) {
		if (globals.notClerkValidation(req, res)){
			// console.log("Interested");
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
		// console.log("in uninterested");
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
			// console.log("600 users.js this.delete.  req.params.id = ",req.params.id)
			// console.log("601 users.js this.delete.  req.params = ",req.params)
			User.remove({_id: req.params.id}, function(err, result){
				if (err){
					console.log(err)
				}
				else{
					// console.log("602 users.js this.delete.  result = ",result)
					res.redirect('/' + req.params.auction  + '/users')
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


}

module.exports = new UsersController();
