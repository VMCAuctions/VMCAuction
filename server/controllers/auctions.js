var mongoose = require("mongoose"),
  Item = require("../models/item.js"),
  Package = require("../models/package.js"),
  Category = require("../models/category.js"),
  User = require("../models/user.js"),
  Auction = require("../models/auction.js"),
  Global = require("../models/global.js"),
  globals = require("../controllers/globals.js");
  var dateFormat = require('dateformat');

const SimpleNodeLogger = require('../../node_modules/simple-node-logger'),
    opts = {
        logFilePath:'./public/vmcLogFile.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
fileLog = SimpleNodeLogger.createSimpleFileLogger( opts );


function AuctionsController() {
  this.index = function(req, res) {
    //Runs user.adminValidation function, which returns false and redirects to the package page if the user does not have organizer status; otherwise, they are an organizer, so they should use the code below to reach the auction create page
    if (globals.adminValidation(req, res)) {
      res.render("auctions", {
        admin: req.session.admin,
        userName: req.session.userName
      });
    } else {
      res.redirect('/users/adminError');
    }
  };

  //organizer landing page
  this.main = function(req, res) {
	fileLog.info("000 auctions.js this.main start. req.session = ", JSON.stringify(req.session, null, 2));
	fileLog.info("001 auctions.js this.main start. req.params = ", JSON.stringify(req.params, null, 2));
    if (globals.adminValidation(req, res)) {
      Auction.find({}, function(err, auctions) {
        if (err) {
          console.log(err);
          fileLog.info("002 auctions.js this.main Auction.find.  err = ", JSON.stringify(err, null, 2));
        } else {
          fileLog.info("002 auctions.js this.main Auction.find.  auctions = ", JSON.stringify(auctions, null, 2));
          //for now the archivd auctions are hard code.
          //later make an if statemtn hat checks if auction is in past
          //based on clock and todays Date
          //if in past push into archived auctions array
          //else push into current auctions and pass to front
          User.findOne({ userName: req.session.userName }, function(err, user) {
            if (err) {
              console.log(err);
              fileLog.info("003 auctions.js this.main User.findOne.  err = ", JSON.stringify(err, null, 2));
            } else {
              console.log("000 auctions.js this.main.  user = ", user);
              fileLog.info("004 auctions.js this.main User.findOne.  user = ", JSON.stringify(user, null, 2));
              res.render("main", {
                user: user,
                auctions: auctions,
                archivedAuctions: [
                  { name: "Fall '17 Gala Puttin' on the Ritz", _id: "1001" },
                  { name: "Christmas 2017 Fundraiser", _id: "1002" },
                  { name: "Las Vegas 2017 Donor Evening", _id: "1236" }
                ]
              });
            }
          });
        }
      });
    } else {
      res.redirect('/users/adminError');
    }
  };

	this.create = function(req, res) {
		// console.log(Date.now()," - 200 auctions.js this.create.  req.body = ",req.body);
		// console.log(Date.now()," - 201 auctions.js this.create.  req.file = ",req.file);
		if (globals.adminValidation(req, res)) {
			Global.findOne({}, function(err, global) {
				if (err) {
					console.log(err);
				}
				if (global.pins.length == 0) {
					console.log("auctions.js this.create  Out of available pins!");
				} else {
					randomPinIndex = parseInt(Math.floor(Math.random() * 9000));
					randomPin = global.pins[randomPinIndex];
					global.pins.splice(randomPinIndex, 1);
					global.save(function(err, result) {
					if (err) {
						console.log(err);
					} else {
						console.log(Date.now()," - 203 auctions.js pre auction create.  req.body = ",req.body);
            // console.log(Date.now()," - 204 auctions.js pre auction create.  req.file = ",req.file);
            var startDate = req.body.startClockDate + "T" + req.body.startClockTime + ":00";
            var start = new Date(startDate);
            var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00";
            var end = new Date(endDate);
						Auction.create({
							name: req.body.name,
							startClock: start,
							endClock: end,
							pin: randomPin,
							subtitle: req.body.subtitle,
							welcomeMessage: req.body.welcomeMessage,
							description: req.body.description,
							venue: req.body.venue,
							headerImage: req.body.imgFileName,
							}, function(err, result) {
								if (err) {
									console.log(err);
								} else {
									// console.log(Date.now()," - 206 auctions.js post auction create.  req.body = ",req.body);
									// console.log(Date.now()," - 207 auctions.js post auction create.  req.file = ",req.file);
									console.log(Date.now()," - 208 auctions.js post auction create.  result = ",result);
									//Perhaps display pin to organizer on creation and/or auction menu page
									res.redirect("/" + result._id + "/organizerMenu");
								}
							}
						);
					}
					});
				}
			});
		} else {
      res.redirect('/users/adminError');
    }
	};


  this.menu = function(req, res) {
    if (globals.adminValidation(req, res)) {
      Auction.findById(req.params.auctions, function(err, auctionDetails) {
        if (err) {
          console.log(err);
        } else {
			// console.log("210 auctions.js this.menu.  req.session = ",req.session);
			if (!req.session.auction){
				req.session.auction = req.params.auctions;
			};
			// console.log("211 auctions.js this.menu.  req.session = ",req.session);
          res.render("organizerMenu", {
            current: "organizerMenu",
            admin: req.session.admin,
            auction: req.params.auctions,
            auctionDetails: auctionDetails, //might be use to display auction name 
            userName: req.session.userName
          });
        }
      });
    } else {
      res.redirect('/users/adminError');
    }
  };


  this.edit = function(req, res) {
	// console.log(Date.now()," - 210 auctions.js this.edit.  req.body = ",req.body);
	// console.log(Date.now()," - 211 auctions.js this.edit.  req.file = ",req.file);
    Auction.findById(req.params.auctions, function(err, auction) {
    // console.log(Date.now()," - 212 auctions.js this.edit.  auction = ",auction);
      stringStartClock = dateFormat(auction.startClock, "yyyy-mm-dd HH:MM");
      stringEndClock = dateFormat(auction.endClock, "yyyy-mm-dd HH:MM");
      console.log("Db",auction.startClock)
      console.log("stringStartClock is", stringStartClock)
      startDate = stringStartClock.substring(0,10);
      startClock = stringStartClock.substring(11,16);
      // console.log("startDate is", startDate)
      // console.log("startClock is", startClock)
      endDate = stringEndClock.substring(0, 10);
      endClock = stringEndClock.substring(11, 16);
      // console.log("enddate", endDate)
      res.render("editAuction", {
        auctionDetails: auction,
        admin: req.session.admin,
        userName: req.session.userName,
        auction: req.params.auctions,
        startDate: startDate,
        startClock: startClock,
        endDate: endDate,
        endClock: endClock,
        pin: auction.pin,
		    headerImage: auction.headerImage
      });
    });
  };



  this.update = function(req, res) {
	// console.log(Date.now()," - 220 auctions.js this.update.  req.body = ",req.body);
	// console.log(Date.now()," - 221 auctions.js this.update.  req.file = ",req.file);
    var startDate = req.body.startClockDate + "T" + req.body.startClockTime + ":00";
    var start = new Date(startDate);
    console.log("Start", start)
    var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00";
    var end = new Date(endDate);
    Auction.findById(req.params.auctions, function(err, auction) {
	  // console.log(Date.now()," - 222 auctions.js this.update.  auction = ",auction);
      if (err) {
        console.log(err);
      } else {
        auction.name = req.body.name || auction.name;
        auction.startClock = start //|| auction.startClock;
        auction.endClock = end //|| auction.endClock;
        auction.subtitle = req.body.subtitle;
        auction.venue = req.body.venue;
        auction.description = req.body.description;
        auction.welcomeMessage = req.body.welcomeMessage;
        if(req.body.imgFileName){
          auction.headerImage = req.body.imgFileName
        }
	    // console.log(Date.now()," - 223 auctions.js this.update pre save.  auction = ",auction);
        // console.log(req.body.pin);
        auction.save()
	    // console.log(Date.now()," - 224 auctions.js this.update post save.  auction = ",auction);
      // console.log(Date.now()," - 225 auctions.js this.update post save.  req.params.auctions = ",req.params.auctions);
      console.log(auction)
        res.redirect("/" + req.params.auctions + "/organizerMenu")
      }
    });
  };

  this.deleteAuction = function(req, res) {
    Auction.remove({ _id: req.params.auctions }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/auctions/main");
      }
    });
  };

  
  this.event = function(req, res) {
    Auction.findById(req.params.auctions, function(err, auction) {
      stringStartClock = auction.startClock.toISOString();
      stringEndClock = auction.endClock.toISOString();
      startDate = stringStartClock.substring(0, 10);
      startClock = stringStartClock.substring(11, 16);
      endDate = stringEndClock.substring(0, 10);
      endClock = stringEndClock.substring(11, 16);
      startDateToDisplay = dateFormat(auction.startClock, "dddd, mmmm dS, yyyy, h:MM TT");
      if (err) {
        console.log(err);
      } else {
        Package.find({ _auctions: req.params.auctions, featured: true}).sort({priority: 'ascending'}).exec(function (err, packages) {
          if (err) {
            console.log(err);
          } else {
			// console.log("230 auctions.js this.event Package.find packages = ",packages);
            res.render("event", {
              auctionDetails: auction,
              auction: req.params.auctions,
              startDateToDisplay: startDateToDisplay,
              startDate: startDate,
              startClock: startClock,
              endDate: endDate,
              endClock: endClock,
              pin: auction.pin,
              packages: packages,
            });
          }
        });
      }
    });
  };


  this.clerk = function(req, res) {
    // console.log('230 auctions.js this.clerk start.  req.params = ',req.params);
    var items = [];
    if (globals.clerkValidation(req, res)) {
      var cart = {};
      User.find({ _auctions: req.params.auctions }, function(err, users) {
        if (err) {
          console.log(err);
        } else if (req.session.admin) {
          Package.find({ _auctions: req.params.auctions })
            .populate("_items")
            .sort({ _category: "ascending" })
            .sort({ priority: "ascending" })
            .sort({ _id: "descending" })
            .exec(function(err, packages) {
              if (err) {
                console.log(err);
              } else {
                for (var x = 0; x < users.length; x++) {
                  var packagesArr = [];
                  
                  var total = 0;
                  for (var y = 0; y < packages.length; y++) {
                    //Not sure if we need this "if" statement for bids.length > 0; needs testing
                    if (packages[y].bids.length > 0){
                      if (
                        packages[y].bids[packages[y].bids.length - 1].name ===
                        users[x].firstName.charAt(0)+'. '+users[x].lastName
                      ) {
                        packagesArr.push(packages[y]);
                        items.push.apply(items,packages[y]._items);
                        total +=
                          packages[y].bids[packages[y].bids.length - 1].bidAmount;
                      }
                    }
                  }
                  cart[users[x].userName] = {
                    packages: packagesArr,
                    items: items,
                    total: total
                  };
                }
                //Current is a flag showing which page is active
                Auction.findById({_id:req.params.auctions}, function(err, auctionDetails){
                  if (err){
                    console.log(err);

                  } else{
                    // console.log('235 auctions.js this.clerk auctionfindById. auctionDetails = ', auctionDetails);  
                    res.render("clerkDash", {
                      current: "Clerk Dashboard",
                      users: users,
                      cart: cart,
                      packages: packages,
                      items: items,
                      userName: req.session.userName,
                      admin: req.session.admin,
                      auctionDetails: auctionDetails,
              		  auction: req.params.auctions,
                    });
                  }
                });
                
              }
            });
        } else {
          res.redirect('/users/clerkError');
        }
      });
    }
  };

  this.pinEntry = function(req, res) {
    res.render("clerks");
  };

  //This code is archived in case we ever go back to manually selecting pins for auctions; will probably be used for auction edit when the user selects a new pin
  this.pinCheck = function(req, res) {
    //Make a check on auction entry that verifies that pin is unique
    Auction.findOne({ pin: req.body.pin }, function(err, auction) {
      if (err) {
        console.log(err);
      } else if (!auction) {
        res.json({ match: false });
      } else {
        req.session.userName = "Clerk";
        //Will probably have to implement this such that admins have a req.session.admin of 2, clerks have an admin status of 1, and everyone else has 0. Not sure if we should make the pin be a clerk's username, or build some logic around such that clerks don't have bidding access but do have a pin in their session and something like a username of Clerk.
        req.session.admin = 1;
        res.json({ match: true, auctions: auction._id });
      }
    });
  };

	// hard coded route for project team member resumes - logs in visitor as organizer
	// this is for dv1.elizabid.com/admin route
 	this.admin = function(req, res) {
		console.log('500 auctions.js this.admin start.  set req.session auction and admin = 2');

		// hard code auction
		// req.session.auctions = "5c59f82b181b703674c1eca5"; // Bob's localhost Getting the Shiny Gold auction
		req.session.auctions = "5c8c111dcc231c37a5ebc440"; // dv1.elizabid.com Fly High Fly Far auction
		// hard code admin = 2
		req.session.admin = 2;
		// hard code userName = Organizer
		req.session.userName = "Organizer";
		console.log("501 auctions.js this.admin .  req.session = ",req.session);


		Auction.findById(req.session.auctions, function(err, auctionDetails) {
			if (err) {
				console.log(err);
			} else {
				console.log("504 auctions.js this.admin Auction.findById.  auctionDetails = ",auctionDetails);
				res.render("organizerMenu", {
					current: "organizerMenu",
					admin: req.session.admin,
					auction: req.session.auctions,
					auctionDetails: auctionDetails, //might be use to display auction name 
					userName: req.session.userName
				});
			}
		});


	}

  //Clerk registering new supporter
  this.clerkRegSup = function(req,res){
    //this page can only be accessed if clerk checked in as
    if(req.session.admin === 1){
      Auction.findById(req.params.auctions, function(err, auction){
        if(err){
          console.log(err);
        }else{
          res.render('clerkRegSupp',{auction: auction.id, auctionDetails: auction})
        }
      })
    }else{
      res.redirect('/users/clerkError');
    }
  };

  this.clerkRegSupCreate = function(req,res){
    Auction.findById(req.params.auctions, function(err, auction){
      if(err){
        console.log(err)
      }else{
        User.findOne({userName: req.body.userName}, function (err, user){
          if(user){
            // res.redirect('/'+req.params.auctions+'/clerk/register-supporter');
            res.redirect('/'+req.params.auctions+'/clerkDash');
          }else{
            User.create({
              userName: req.body.userName,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              phone: req.body.phoneNumber,
              streetAddress: req.body.streetAddress,
              city: req.body.city,
              states: req.body.states,
              zip: req.body.zip,
              _auctions: auction,
              admin: 0,
              table: req.body.table,
              tableOwner: req.body.tableOwner,
              tableOwnerName: req.body.tableOwnerName,
              userOrg: req.body.userOrg
            })
            res.redirect("/"+req.params.auctions+"/clerkDash")
          }
        })
      }
    })
  };

  this.clerkcheckin = function(req, res) {
	Auction.findById(req.params.auctions, function(err, auction){
		var bidders = [];
		if(err){
			console.log(err)
		}else{
			User.find({_auctions: req.params.auctions}, function(err, users){
				if(err){
					console.log(err)
				}else{
					Package.find({ _auctions: req.params.auctions })
						.exec(function(err, packages) {
							if (err) {
								console.log(err);
							} else {

								var packageBids = packages.map(function(wholePkg) {
									return wholePkg.bids;
								});
								
								for (var i = 0; i < packageBids.length; i++) {
									for (var j = 0; j < packageBids[i].length; j++) {
										if (!bidders.includes(packageBids[i][j].name)) {
											bidders.push(packageBids[i][j].name);
										}
									}
								}
								req.session.auctionID = auction._id;
								res.render("clerkCheckinSearch", {
									auction: auction,
									users: users,
									bidders: bidders
								});
							}
						});
				}
			});
		}
	});
  };

  this.clerkUserCheckIn = function(req, res){
    User.findById(req.params.user, function(err, user){
      if(err){
        console.log(err)
      }else{
        auctionID = req.session.auctionID
        res.render('clerkCheckinUpdate', {user: user, auctionID : auctionID})
      }
    })
  }

  this.clerkUserUpdate = function(req, res){
    User.findById(req.params.user, function(err, user){
      if(err){
        console.log(err)
      }else{
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.phone = req.body.phone;
        user.userName = req.body.userName;
        user.streetAddress = req.body.address;
        user.city = req.body.city;
        user.states = req.body.states;
        user.zip = req.body.zip;
        user.save()
        res.redirect('/')
      }
    })
  }


  this.clerkcheckout = function(req, res){
    // console.log("230 auctions.js this.clerk start.  req.body = ",req.body);
		// console.log("231 auctions.js this.clerk start.  req.params = ",req.params);
		// console.log("232 auctions.js this.clerk start.  req.session = ",req.session);
		var items = [];
		if (globals.clerkValidation(req, res)) {
		  var cart = {};
		  User.find({ _auctions: req.params.auctions }, function(err, users) {
			if (err) {
			  console.log(err);
			} else if (req.session.admin) {
			  Package.find({ _auctions: req.params.auctions })
				.populate("_items")
				.sort({ _category: "ascending" })
				.sort({ priority: "ascending" })
				.sort({ _id: "descending" })
				.exec(function(err, packages) {
					if (err) {
					console.log(err);
					} else {
						// console.log("234 auctions.js this.clerk Package.find.  packages = ",JSON.stringify(packages, null, 2));
						for (var x = 0; x < users.length; x++) {
							var packagesArr = [];
							var total = 0;
							for (var y = 0; y < packages.length; y++) {
								//Not sure if we need this "if" statement for bids.length > 0; needs testing
								if (packages[y].bids.length > 0){
									if (packages[y].bids[packages[y].bids.length - 1].name === users[x].firstName.charAt(0)+'. '+users[x].lastName || packages[y].bids[packages[y].bids.length - 1].name === users[x].firstName+' '+users[x].lastName) {
										packagesArr.push(packages[y]);
										items.push.apply(items,packages[y]._items);
										total += packages[y].bids[packages[y].bids.length - 1].bidAmount;
									}
								}
							}
							cart[users[x].userName] = {
								packages: packagesArr,
								items: items,
								total: total
							};
						}
						//Current is a flag showing which page is active
						Auction.findById({_id:req.params.auctions}, function(err, auctionDetails){
							if (err){
								console.log(err);
							} else{
								console.log('236 auctions.js this.clerk auctionfindById. auctionDetails = ', auctionDetails);  
								// console.log('237 auctions.js this.clerk auctionfindById. cart = ', JSON.stringify(cart, null, 2));  
								res.render("clerkCheckoutSearch", {
									current: "Clerk Dashboard",
									users: users,
									cart: cart,
									packages: packages,
									items: items,
									userName: req.session.userName,
									admin: req.session.admin,
									auctionDetails: auctionDetails,
									auction: req.params.auctions
								});
							}
						});
					}
				});
			} else {
				res.redirect("/" + req.params.auctions + "/event");
			}
		});
		}
  }

  
} //enclosing bracket
module.exports = new AuctionsController();
