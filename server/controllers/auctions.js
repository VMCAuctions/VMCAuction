var mongoose = require("mongoose"),
  Item = require("../models/item.js"),
  Package = require("../models/package.js"),
  Category = require("../models/category.js"),
  User = require("../models/user.js"),
  Auction = require("../models/auction.js"),
  Global = require("../models/global.js"),
  globals = require("../controllers/globals.js");
  var dateFormat = require('dateformat');

function AuctionsController() {
  this.index = function(req, res) {
    //Runs user.adminValidation function, which returns false and redirects to the package page if the user does not have organizer status; otherwise, they are an organizer, so they should use the code below to reach the auction create page
    if (globals.adminValidation(req, res)) {
      res.render("auctions", {
        admin: req.session.admin,
        userName: req.session.userName
      });
    }
  };
  //organizer landing page
  this.main = function(req, res) {
    if (globals.adminValidation(req, res)) {
      Auction.find({}, function(err, auctions) {
        if (err) {
          console.log(err);
        } else {
          //for now the archivd auctions are hard code.
          //later make an if statemtn hat checks if auction is in past
          //based on clock and todays Date
          //if in past push into archived auctions array
          //else push into current auctions and pass to front
          User.findOne({ userName: req.session.userName }, function(err, user) {
            if (err) {
              console.log(err);
            } else {
              console.log("user is", user);
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
      res.redirect("/" + req.session.auction + "/packages");
    }
  };
  //Just used as an API for now
  this.create = function(req, res) {
    // console.log("req.body.startClockDate is", req.body.startClockDate)
    // console.log("req.body.startClockTime is", req.body.startClockTime)
    // Add validations to ensure auction start occurs before auction end

    if (globals.adminValidation(req, res)) {
      var startDate =
        req.body.startClockDate + "T" + req.body.startClockTime + ":00";
      var start = new Date(startDate);
      var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00";
      var end = new Date(endDate);
      Global.findOne({}, function(err, global) {
        console.log(global);
        if (err) {
          console.log(err);
        }
        if (global.pins.length == 0) {
          console.log("Out of available pins!");
        } else {
          randomPinIndex = parseInt(Math.floor(Math.random() * 9000));
          randomPin = global.pins[randomPinIndex];
          global.pins.splice(randomPinIndex, 1);

          global.save(function(err, result) {
            if (err) {
              console.log(err);
            } else {
              Auction.create(
                {
                  name: req.body.name,
                  startClock: start,
                  endClock: end,
                  pin: randomPin,
                  subtitle: req.body.subtitle,
                  welcomeMessage: req.body.welcomeMessage,
                  description: req.body.description,
                  venue: req.body.venue
                },
                function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                    //Perhaps display pin to organizer on creation and/or auction menu page
                    res.redirect("/" + result._id + "/organizerMenu");
                  }
                }
              );
            }
          });
        }
      });
    }
  };
  this.menu = function(req, res) {
    if (globals.adminValidation(req, res)) {
      Auction.findById(req.params.auctions, function(err, auctionDetails) {
        if (err) {
          console.log(err);
        } else {
          console.log("auction details", auctionDetails);
          // res.locals.auctionName = auctionDetails.name; // to make the auction name available in all in Headers when added to any page
          res.render("organizerMenu", {
            page: "organizerMenu",
            admin: req.session.admin,
            auction: req.params.auctions,
            auctionDetails: auctionDetails, //might be use to display auction name 
            userName: req.session.userName
          });
        }
      });
    }
  };
  this.edit = function(req, res) {
    Auction.findById(req.params.auctions, function(err, auction) {
      stringStartClock = auction.startClock.toISOString();
      stringEndClock = auction.endClock.toISOString();
      // console.log("stringStartClock is", stringStartClock)
      startDate = stringStartClock.substring(0, 10);
      startClock = stringStartClock.substring(11, 16);
      // console.log("startDate is", startDate)
      // console.log("startClock is", startClock)
      endDate = stringEndClock.substring(0, 10);
      endClock = stringEndClock.substring(11, 16);
      res.render("editAuction", {
        auctionDetails: auction,
        admin: req.session.admin,
        userName: req.session.userName,
        auction: req.params.auctions,
        startDate: startDate,
        startClock: startClock,
        endDate: endDate,
        endClock: endClock,
        pin: auction.pin
      });
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
            console.log(packages);
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

  this.update = function(req, res) {
    // console.log("req.body is", req.body)
    // console.log("we are in the update function")
    console.log("in this.update");
    var startDate =
      req.body.startClockDate + "T" + req.body.startClockTime + ":00";
    var start = new Date(startDate);
    var endDate = req.body.endClockDate + "T" + req.body.endClockTime + ":00";
    var end = new Date(endDate);
    Auction.findById(req.params.auctions, function(err, auction) {
      if (err) {
        console.log(err);
      } else {
        auction.name = req.body.name || auction.name;
        auction.startClock = start || auction.startClock;
        auction.endClock = end || auction.endClock;
        auction.subtitle = req.body.subtitle;
        auction.venue = req.body.venue;
        auction.description = req.body.description;
        auction.welcomeMessage = req.body.welcomeMessage;
        console.log(req.body.pin);
        auction.save()
        res.redirect(
        "/" + req.params.auctions + "/organizerMenu"
        )
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

  this.clerk = function(req, res) {
    console.log("Clerk landing page");
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
            .exec(function(err, result) {
              if (err) {
                console.log(err);
              } else {
                for (var x = 0; x < users.length; x++) {
                  var packages = [];
                  var items = [];
                  var total = 0;
                  for (var y = 0; y < result.length; y++) {
                    //Not sure if we need this "if" statement for bids.length > 0; needs testing
                    if (result[y].bids.length > 0){
                      if (
                        result[y].bids[result[y].bids.length - 1].name ===
                        users[x].firstName.charAt(0)+'. '+users[x].lastName
                      ) {
                        packages.push(result[y]);
                        items.push.apply(items,result[y]._items);
                        total +=
                          result[y].bids[result[y].bids.length - 1].bidAmount;
                      }
                    }

                  }
                  cart[users[x].userName] = {
                    packages: packages,
                    items: items,
                    total: total
                  };
                }
                res.render("clerkDash", {
                  page: "Clerk Dashboard",
                  users: users,
                  cart: cart,
                  packages: result,
                  items: items,
                  userName: req.session.userName,
                  admin: req.session.admin,
                  auction: req.params.auctions
                });
              }
            });
        } else {
          res.redirect("/" + req.params.auctions + "/packages");
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
}

module.exports = new AuctionsController();
