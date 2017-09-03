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

		User.findOne({userName: req.body.userName}, function(err, user) {
			if(err){
				console.log("error while determining unique username");
				console.log(err)
			}
			else if(user){
				console.log("username already used");
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
                  ["phoneNumber", 7, "phone number"],
                  ["email", 3, "email address"],
                  ["userName", 8, "user name"],
                  ["password", 8, "password"]
								];
								let output = [];
								for(let i = 0; i < validationArray.length; i++) {
									if (req.body[validationArray[i][0]].length < validationArray[i][1]) {
										output.push("Please insert a " + validationArray[i][2] + " that is at least " + validationArray[i][1] + " characters in length.")
									}
								}
								return output
							}
							const validation = registrationValidation()

							if(validation){
								res.json(validation)
								return;
							}

							//Else, validation is ok, so hash the password and add to the database
							hashedPassword = hash;
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
								password: hash,
							},
							function(err, result){
									if(err){
										console.log('User.create error');
										console.log(err)
										res.status(500).send('Failed to Create User');
									}
									else{
										res.json(result);
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
				res.status(500).send('User not Found');
			}
			else{
				//Comparing inputted password to hashed password in db
				bcrypt.compare(req.body.password, user.password, function(err, match) {
					if(err){
						console.log(err)
					}
					else if(match){
						console.log("passwords match!")
						res.json(user)
					}
					else{
						console.log("password don't match")
						// res.json(user);
						// console.log("incorrect password")
						// console.log(bcrypt.compareSync(req.body.password, user.password))
						// console.log(typeof(req.body.password))
						// console.log(typeof(user.password.length))
						// res.status(401).send('Password Validation Failed');
					}
				})
			}
		})
	}
	// get the screen for one user with all his/her bidded packages, noting which packages he/she is currently winning
	this.show = function(req,res){
		console.log('UsersController show');
        User.findById(req.params.id, function(err, result){
            if(err){
                console.log('user show-err');
            }else{
                req.json(result);
            }
        });
	};
	//are we allowing users to be able to edit / update their information
    this.update = function(req,res){
		console.log('UsersController update');
	}


}
module.exports = new UsersController();
