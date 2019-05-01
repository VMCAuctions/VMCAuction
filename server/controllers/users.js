
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
	User = require('../models/user.js'),
	Category = require('../models/category.js'),
	Package = require('../models/package.js'),
	Auction = require('../models/auction.js'),
	globals = require('../controllers/globals.js')
	secret = require('../config/secret.json')
const csv=require('csvtojson')



const SimpleNodeLogger = require('../../node_modules/simple-node-logger'),
    opts = {
        logFilePath:'./public/vmcLogFile.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
fileLog = SimpleNodeLogger.createSimpleFileLogger( opts );


// Twilio SMS text code:
const accountSid = secret.accountSid;
const authToken = secret.authToken;
const client = require('twilio')(accountSid, authToken);

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
					fileLog.info("000 users.js this.index User.find.  err = ", JSON.stringify(err, null, 2))
				}else if(req.session.admin){
						// console.log("012 users.js this.index User.find.  users = ",users);
						Package.find({_auctions: req.params.auctions}, function(err, packages){
							if (err){
								console.log(err)
								fileLog.info("001 users.js this.index Package.find.  err = ", JSON.stringify(err, null, 2))
							}else{
								for (var i = 0; i < users.length; i++) {
									var packages = []
									var total = 0
									for (var j = 0; j < packages.length; j++) {
										if (packages[j].bids[packages[j].bids.length-1]){
											if(packages[j].bids[packages[j].bids.length-1].name===users[i].userName) {
												packages.push(packages[j])
												total +=packages[j].bids[packages[j].bids.length-1].bidAmount
											}
										}
									}
									cart[users[i].userName]={'packages': packages, 'total': total };
								}
								//Find Auction and render auction details is needed to display the name of the auction in the adminHeader, when adminHeader is displayed on this page
								Auction.findById(req.params.auctions, function (err, auctionDetails) {
									if (err) {
										console.log(err)
										fileLog.info("002 users.js this.index Auction.findById.  err = ", JSON.stringify(err, null, 2))
									} else {	
										//current is a flag showing which page is active
										res.render('allUsers', {
											current: 'supporters', 
											users: users, 
											cart: cart, 
											packages: packages, 
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
				fileLog.info("003 users.js this.admin User.find.  err = ", JSON.stringify(err, null, 2))
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
				fileLog.info("004 users.js this.showAccount User.findOne.  err = ", JSON.stringify(err, null, 2))
			}else if(user.userName === req.session.userName || req.session.admin >= 1){
				// console.log("100 users.js this.showAccount User.findOne.  user = ",user)
				Auction.findById(req.params.auctions, function (err, auctionDetails) {
					if (err) {
						console.log(err)
						fileLog.info("005 users.js this.showAccount Auction.findById.  err = ", JSON.stringify(err, null, 2))
					} else {
						if (user.userName != req.session.userName) {
							res.render('userAccount', {
								user: user,
								phone: user.phone,
								admin: req.session.admin,
								auction: req.params.auctions,
								userName: req.session.userName,
								auctionDetails: auctionDetails,
								table: user.table,
								tableOwner: user.tableOwner
							})
						} else {
							res.render('userAccount', {
								//current is a flag showing which page is active
								current: 'myAccount',
								user: user,
								admin: req.session.admin,
								auction: req.params.auctions,
								userName: req.session.userName,
								auctionDetails: auctionDetails,
								table: user.table,
								tableOwner: user.tableOwner
							})
						}
					}
				})
			}else{
				res.redirect('/users/login')
			}
		})
	};

	this.new = function(req,res) {
		//May need to add validation checks so that only admins can see
		Auction.findById(req.params.auctions, function (err, auctionDetails) {
			if (err) {
				console.log(err)
				fileLog.info("005 users.js this.new Auction.findById.  err = ", JSON.stringify(err, null, 2))
			} else {
				res.render('userCreate', {
					admin: req.session.admin, 
					userName: req.session.userName, 
					auction: req.params.auctions, 
					auctionDetails: auctionDetails
				})
			}
		})
	};


	this.duplicate = function (req, res) {
		let user = req.query.userName;
		// console.log(req.query)
		User.findOne({userName: { $regex : new RegExp(user, "i") }}, function (err, duplicate) {
			if(err){
				console.log(err);
				fileLog.info("006 users.js this.duplicate User.findOne  err = ", JSON.stringify(err, null, 2))
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
		console.log("010 users.js this.create start.  req.body = ", req.body)
		//we are looking for duplicates again incase frontend validation failed is here just in case
		let user = req.body.userName;
		User.findOne({userName: { $regex : new RegExp(user, "i") }}, function (err, duplicate) {
			if(err){
				console.log(err)
				fileLog.info("007 users.js this.create User.findOne  err = ", JSON.stringify(err, null, 2))
			}
			else if(duplicate){
				// console.log(duplicate);
			}else{
				//start actual registration
				bcrypt.hash(req.body.password, null, null, function(err, hash) {
						if(err){
							console.log(err)
							fileLog.info("008 users.js this.create User.findOne  err = ", JSON.stringify(err, null, 2))
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
								admin: adminStatus,
								table: req.body.table,
								tableOwner: req.body.tableOwner,
								tableOwnerName: req.body.tableOwnerName,
								// seats: req.body.seats,
								userOrg: req.body.userOrg
							},
							function(err, user){
									if(err){
										console.log(err)
										fileLog.info("009 users.js this.create User.create  err = ", JSON.stringify(err, null, 2))
									}else{
										// console.log("linkedAuction is", linkedAuction)
										// console.log("req.session is", req.session)
										// console.log("afterwards, req.session is", req.session)
										
										if (req.body.admin) {
											res.redirect('/' + linkedAuction + '/users');
										} else {
											req.session.auction = linkedAuction
											req.session.userName = user.userName
											req.session.admin = user.admin
											res.redirect('/' + linkedAuction + '/packages')
										}
										return;
									}
							});
						}
				});
			}
		})
	};


	this.checkLogin = function(req, res){
		// console.log("in check login");
		var name = req.body.userName;
		// console.log(Date.now(),"000 users.js checkLogin.  r.b.userName = ",req.body.userName)
		User.findOne({userName: { $regex : new RegExp(name, "i") }}, function(err, user){
			if(err){
				// console.log("001 users.js checkLogin.  err = ",err);
				fileLog.info("010 users.js checkLogin.  err = ",JSON.stringify(err, null, 2));
				res.json({match: false})

			 }
			//  else if(!user){
			// 	// console.log("002 users.js checkLogin.  !user block");
			// 	res.json({match: false})
			// }
			// else if(user){
			else {

				console.log("004 users.js checkLogin.  user = ",user)
				fileLog.info("010 users.js checkLogin.  user = ",JSON.stringify(user, null, 2));
				console.log("005 users.js checkLogin user._auctions = ", user._auctions)
				req.session.auction = user._auctions
				req.session.userName = user.userName
				req.session.admin = user.admin
				req.session.user = user
				fileLog.info("011 users.js checkLogin.  post session assign  req.session = ",JSON.stringify(req.session, null, 2));
				res.json({match: true, auction: user._auctions, admin:user.admin})

			}
		})
	}

	

	// from app.get('/:auctions/users/account/:userName' - renders user watch list (userPage.ejs)
	// user account information is handled by this.showAccount; 
	this.show = function(req,res){
		fileLog.info("100 users.js this.index start. req.session = ", JSON.stringify(req.session, null, 2));
		fileLog.info("101 users.js this.index start. req.params = ", JSON.stringify(req.params, null, 2));
		// console.log('UsersController show');
		var cartArray = []
		var cartTotal = 0
		Package.find({_auctions: req.params.auctions}).sort({priority: 'ascending'}).sort({_id:'ascending'}).exec(function(err, result) {
			if (err){
				console.log(err)
				fileLog.info("011 users.js this.show Package.find  err = ", JSON.stringify(err, null, 2))
			}else{
				for (var i = 0; i < result.length; i++){
					if (result[i].bids.length > 0){
						if (result[i].bids[result[i].bids.length - 1].name == req.params.userName){
							cartArray.push(result[i])
							console.log(cartArray);
							cartTotal += result[i].bids[result[i].bids.length - 1].bidAmount
						}
					}
				}
				User.findOne({userName: req.params.userName}).populate("_packages").exec( function(err, user){
					if(err){
						console.log(err)
						fileLog.info("112 users.js this.show User.findOne  err = ", JSON.stringify(err, null, 2))
					} else if (user.userName === req.session.userName | req.session.admin === true){
						Auction.findById(req.params.auctions, function (err, auctionDetails) {
							if (err) {
								console.log(err)
								fileLog.info("113 users.js this.show Auction.findById  err = ", JSON.stringify(err, null, 2))
							} else {
								fileLog.info("114 users.js this.show Auction.findById  auctionDetails = ", JSON.stringify(auctionDetails, null, 2))
								Category.find({}, function(err, categories){
									if (err){
										console.log(err)
									}
									else if (result.length === 0){
										console.log("running categoriesinitialize")
										categories.initialize()
									}
									else{
										// console.log("req.session is", req.session)
										res.render('userPage', {
											current: 'watch-list',
											userName: req.session.userName,
											admin: req.session.admin,
											user: user,
											categories: categories,
											cartTotal: cartTotal,
											cartArray: cartArray,
											auction: req.params.auctions,
											auctionDetails: auctionDetails,
										})
										console.log("User info: ", user);
										fileLog.info("014 users.js this.show res.render  user = ", JSON.stringify(user, null, 2))
									}
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

	//function to let organizer change her password. It works but can't login with new password for some reason. Apparently because her old password is hardcoded?
	//3.2019 update - instead, using this for supporter to be able to edit their account.
	//code for changing password is commented out.
	this.update = function(req,res){
		
		console.log("380 users.js this.update.  req.body = ", req.body)
		console.log("381 users.js this.update.  req.session = ", req.session)
		console.log("382 users.js this.update.  req.params = ", req.params)
		User.findOne({userName: req.body.userName}, function(err, user) {
			if (err) {
				console.log(err);
			} else {
				user.firstName = req.body.firstName;
				user.lastName = req.body.lastName;
				user.streetAddress = req.body.address;
				user.userOrg = req.body.userOrg;
				user.city = req.body.city;
				user.states = req.body.states;
				user.zip = req.body.zip;
				user.table = req.body.table;

				user.tableOwner = req.body.tableOwner;
				user.tableOwnerName = req.body.tableOwnerName;

				user.save();
				res.redirect("/" + req.params.auctions + "/users/account/" + req.body.userName);
			}
		});

		// bcrypt.hash(req.body.newPass, null, null, function(err, hash) {
		// 	User.findOne({userName: req.body.userName}, function(err, user) {
		// 		if (err) {
		// 			console.log(err);
		// 		} else {
		// 			user.password = hash;
		// 			user.save();
		// 			res.redirect("/" + req.params.auctions + 
		// 			"/users/account/" + req.params.userName);
		// 		}
		// 	});
		// });
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
		const path = "./public/";

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

					console.log("405.5 users.js this.usersCsv pre User.create.  user in jsonObj[i] = ",jsonObj[i])

					User.create({
						userName: jsonObj[i]["User Name"],
						firstName: jsonObj[i]["First Name"],
						lastName: jsonObj[i]["Last Name"],
						phone: jsonObj[i]["Phone"],
						userOrg: jsonObj[i]["Organization"],
						streetAddress: jsonObj[i]["Street"],
						city: jsonObj[i]["City"],
						states: jsonObj[i]["State"],
						zip: jsonObj[i]["Zip"],
						admin: jsonObj[i]["Admin"],
						table: jsonObj[i]["Table"],
						tableOwner: jsonObj[i]["Table Owner"],
						tableOwnerName: jsonObj[i]["Table Owner Name"],
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

	//This displays the user account information, as opposed to their watchlist information, which is handled by this.show
	this.sendSMS = function(req,res){
		console.log("400 users.js this.sendSMS start.  req.body = ", req.body)
		console.log("401 users.js this.sendSMS start.  req.params = ", req.params)
		let phone = req.body.phone;
		let userId = req.body.userId;
		let auctionId = req.body.auction;
		let msgBody = 'Here\'s the link to the auction!.  Note: This is your personal unique link.  Do not share with anyone!\n https://dv1.elizabid.com/' + auctionId + '/supporter/' + userId;
		console.log("401 users.js this.sendSMS msgBody = ", msgBody)

		client.messages
		.create({
			body: msgBody,
			from: '+14084098185',
			to: '+1'+phone
		})
		.then(message => console.log("410 users.js this.sendSMS client.msgs.  msg.sid = ",message.sid));

		console.log("410 users.js this.sendSMS.  End message send")
		res.redirect('/' + req.body.auction + '/clerkDash')

	}

	this.error = function(req,res){
		//The registration page will now hold a dropdown menu with all of the active auctions (starttime before today, endtime after today), so that they can select the auction they want to register for; this list of actions will be passed here from a mongo query
		//Auction.find()
		res.render('adminError', {
			userName: req.session.userName,
			admin: req.session.admin,
			auction:req.session.auction
		})
	};

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
					fileLog.info("015 users.js this.interested User.findOne  err = ", JSON.stringify(err, null, 2))
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

				res.redirect('/' + req.params.auctions  + '/packages/#' +req.params.id)
			})
		}
	};

	this.uninterested= function(req,res) {
		// console.log("in uninterested");
		User.findOne({userName: req.session.userName}, function(err, user) {
			if (err) {
				console.log(err);
				fileLog.info("016 users.js this.uninterested User.findOne  err = ", JSON.stringify(err, null, 2))
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

	        //As of April 2019, decision has been to allow the supporter to add to /remove from watch list  by remaining in the catalog page
				res.redirect('/' + req.params.auctions  + '/packages/#' + req.params.id);
				

			}
		})
	};

	this.interestedInPackage = function(req, res) {
		if (globals.notClerkValidation(req, res)){
			// console.log("Interested");
			User.findOne({userName: req.session.userName}, function(err, user) {
				if (err) {
					console.log(err);
					fileLog.info("017 users.js this.interestedInPackage User.findOne  err = ", JSON.stringify(err, null, 2))
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
				res.redirect('/' + req.params.auctions  + '/packages/' +req.params.id)
			})
		}
	};

	this.uninterestedInPackage = function(req,res) {
		// console.log("in uninterested");
		User.findOne({userName: req.session.userName}, function(err, user) {
			if (err) {
				console.log(err);
				fileLog.info("018 users.js this.uninterestedInPackage User.findOne  err = ", JSON.stringify(err, null, 2))
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
				res.redirect('/' + req.params.auctions  + '/packages/' + req.params.id)
			}
		})
	};

	this.interestedInFeatured = function(req, res) {
		if (globals.notClerkValidation(req, res)){
			// console.log("Interested");
			User.findOne({userName: req.session.userName}, function(err, user) {
				if (err) {
					console.log(err);
					fileLog.info("019 users.js this.interestedInFeatured User.findOne  err = ", JSON.stringify(err, null, 2))
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
								fileLog.info("020 users.js this.uninterestedInFeatured user.save  err = ", JSON.stringify(err, null, 2))
							}
						});
					}else{
						flag = false;
					}
				}
				res.redirect('/' + req.params.auctions  + '/featured-packages/#' + req.params.id);
			})
		}
	};


	this.uninterestedInFeatured = function(req,res) {
		// console.log("in uninterested");
		User.findOne({userName: req.session.userName}, function(err, user) {
			if (err) {
				console.log(err);
				fileLog.info("021 users.js this.uninterestedInFeatured User.findOne  err = ", err)
			}else{
				for (var i = 0; i < user._packages.length; i++) {
					if (user._packages[i] == req.params.id) {
						user._packages.splice(i,1)
						user.save(function (err, result) {
							if (err) {
								console.log(err);
								fileLog.info("022 users.js this.uninterestedInFeatured user.save  err = ", JSON.stringify(err, null, 2))
							}
						})
						break
					}
				};
				// 1-17 Bug Fix List Item 16 Set redirect back to Watch List instead of packages
				// res.redirect('/' + req.params.auctions  + '/users/' + req.session.userName)

				//Das of April 2019, decision has been to allow the supporter to add to /remove from watch list  by remaining in the catalog page
				res.redirect('/' + req.params.auctions  + '/featured-packages/#' + req.params.id);
				
			}
		})
	};

	this.uninterestedWatchList = function(req,res) {
		// console.log("in uninterested");
		User.findOne({userName: req.session.userName}, function(err, user) {
			if (err) {
				console.log(err);
				fileLog.info("023 users.js this.uninterestedInWatchList User.findOne  err = ", JSON.stringify(err, null, 2))
			}else{
				for (var i = 0; i < user._packages.length; i++) {
					if (user._packages[i] == req.params.id) {
						user._packages.splice(i,1)
						user.save(function (err, result) {
							if (err) {
								console.log(err);
								fileLog.info("024 users.js this.uninterestedInWatchList user.save  err = ", JSON.stringify(err, null, 2))
							}
						})
						break
					}
				};

				// 1-17 Bug Fix List Item 16 Set redirect back to user page instead of packages
				// res.redirect('/' + req.params.auctions  + '/packages')
				res.redirect('/' + req.params.auctions  + '/users/' + req.session.userName)

				//Das of April 2019, decision has been to allow the supporter to add to /remove from watch list  by remaining in the catalog page
				// res.redirect('/' + req.params.auctions  + '/packages/#' + req.params.id);
				

			}
		})
	};







	this.updateList = function(req,res){
		if (globals.notClerkValidation(req, res)){
			User.findById(req.params.userId,function(err,user){
				if (err){
					console.log(err)
					fileLog.info("025 users.js this.updateList User.findById  err = ", JSON.stringify(err, null, 2))
				}else{
					var updatedList = req.params.result.split(',')
					for(let i = 0; i < updatedList.length; i++){
						updatedList[i] = parseInt(updatedList[i])
					}
					user._packages = updatedList
					user.save(function(err,result){
						if(err){
							console.log(err)
							fileLog.info("026 users.js this.updateLIst User.save  err = ", JSON.stringify(err, null, 2))
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
