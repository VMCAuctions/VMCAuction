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

		User.findOne({userName: req.body.userName}, function(err, duplicate) {
			if(err){
				console.log("error while determining unique username");
				console.log(err)
			}
			else if(duplicate){
				res.json({validated: false, message: "That username has already been used. Please pick a unique username."})
			}
			else{
				bcrypt.hash(req.body.password, null, null, function(err, hash) {
						if(err){
							console.log("Password hash error");
							console.log(err)
						}
						else{
							//The below function checks every parameter of req.body against the value in the first index of each array, using the zero index of each array as a specifier.  If the length is less than that, it uses the second index to help generate an error message and pushes it to output.
							function registrationValidation() {
								const validationArray = [
									["firstName", 2, "first name"],
                  ["lastName", 2, "last name"],
                  ["streetAddress", 2, "street address"],
                  ["city", 2, "city"],
                  ["states", 2, "state"],
                  ["zip", 5, "zip code"],
                  ["phoneNumber", 10, "phone number"],
                  ["email", 5, "email address"],
									["creditCard", 15, "credit card number"],
									["ccMonth", 2, "credit card expiration month"],
									["ccYear", 2, "credit card expiration year"],
									["cvv", 3, "credit card security code"],
                  ["userName", 5, "user name"],
                  ["password", 6, "password"]
								];
								let output = "";
								for(let i = 0; i < validationArray.length; i++) {
									if (req.body[validationArray[i][0]].length < validationArray[i][1]) {
										output += "Please insert a " + validationArray[i][2] + " that is at least " + validationArray[i][1] + " characters in length.\n";
									}
								}
								return output
							}
							const validation = registrationValidation()

							if(validation.length > 0){
								res.json({validated: false, message: validation})
								return;
							}

							//Else, validation is ok, so hash the password and add to the database
							hashedPassword = hash;
							var adminStatus = (req.body.userName == "admin");
							User.create({
								userName: req.body.userName,
								firstName: req.body.firstName,
								lastName: req.body.lastName,
								phone: req.body.phoneNumber,
								email: req.body.email,
								creditCard: req.body.creditCard,
								ccMonth: req.body.ccMonth,
								ccYear: req.body.ccYear,
								cvv: req.body.cvv,
								streetAddress: req.body.streetAddress,
								city: req.body.city,
								states: req.body.states,
								zip: req.body.zip,
								password: hash,
								admin: adminStatus
							},
							function(err, user){
									if(err){
										console.log('User.create error');
										console.log(err)
										res.status(500).send('Failed to Create User');
									}
									else{
										req.session.put("userName", user.userName)
										req.session.put("admin", user.admin)
										res.json({validated: true, user: user, message: "Welcome, " + user.userName + "!"});
										res.json();
										return;
									}
							});
						}
				});
			}
		})
	};

	// TESTING, NOT ENCRYPTING PASSWORD YET ///////////////////////////////////
	this.login = function(req,res){

		console.log('UsersController login');
		User.findOne({userName: req.body.userName}, function(err, user){
			if(err){
				console.log('User.login error');
				res.status(500).send('Error upon searching database for username');
			}
			else if(user){
				//Comparing inputted password to hashed password in db
				bcrypt.compare(req.body.password, user.password, function(err, match) {
					if(err){
						console.log("bcrypt compare error")
						res.status(500).send("Error upon searching database for password");
					}
					else if(match){
						req.session.put("userName", user.userName)
						req.session.put("admin", user.admin)
						res.json({search: true, user: user, message: "Welcome, " + user.userName + "!"})
					}
					else{
						res.json({search: false, message: "Password does not match our database. Please ensure the information is correct, or click 'Sign Up' to register for a new account."})
					}
				})
			}
			else{
				res.json({search: false, message: "Username is not in our database. Please ensure the information is correct, or click 'Sign Up' to register for a new account."})
			}
		})
	}
	// get the screen for one user with all his/her bidded packages, noting which packages he/she is currently winning
	this.show = function(req,res){
		console.log('UsersController show');
        // User.findById(req.params.id, function(err, result){
        //     if(err){
        //         console.log('user show-err');
        //     }else{
        //         req.json(result);
        //     }
        // });
		User.findOne({userName: req.params.userName}, function(err, user){
			if(err){
				console.log(err)
			}
			else{
				res.json(user)
			}
		})
	};
	//are we allowing users to be able to edit / update their information
    this.update = function(req,res){
		console.log('UsersController update');
	}

	this.loggedin = function(req,res){
		console.log('reached loggedin function in server')
		var login_check = false;
		var admin;

		if (req.session.get("userName") != undefined){
			login_check = true;
		}

		if(req.session.get("admin") == true){
			admin = true;
		}else{
			admin = false;
		}
		res.json({login_check: login_check, admin: admin})
	}

	this.logout = function(req,res){
		console.log("reached logout function on backend")
		console.log("before flush,", req.session.get("userName"))
		req.session.flush();
		console.log("after flush,", req.session.get("userName"))
		req.session.save(function(err, result){
			if(err){
				console.log(err)
			}
			else{
				res.json()
			}
		})
	}

	this.who_is_logged_in = function(req, res){
		console.log("checking who is logged in")
		console.log("this is who is logged in>>>>>>> ", req.session.get("userName"), "the admin status is: ", req.session.get("admin"));

		if(req.session.get("admin") == true){
			res.json({admin: true})
		}else{
			res.json({admin: false})
		}
	}
}
module.exports = new UsersController();
