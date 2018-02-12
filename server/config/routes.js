var items = require('../controllers/items.js');
var packages = require('../controllers/packages.js');
var users = require('../controllers/users.js');
var categories = require('../controllers/categories.js')
var path = require("path");

module.exports = function(app) {

	// get the Login/Registration screen.  This is our root route //
	// ITEMS //
	// get the index page of all items
	app.get('/api/items', function(req,res){
		items.index(req,res)});
	// get the new item form
	app.get('/api/items/new', function(req,res){
		items.new(req,res)});
	// post the new item form and create that new item
	app.post('/api/items', function(req,res){
		items.create(req,res)});
	// show a single item (might be handled solely by React)
	app.get('/api/items/:id', function(req,res){
		items.edit(req,res)});
	// update a single item
	app.post('/api/items/:id', function(req,res){
		items.update(req,res)});
	//deleting an item
	app.get('/api/remove_item/:id', function(req, res){
		items.remove_item(req, res)});




	// PACKAGES //
	// get the index page of all packages
	app.get('/api/packages', function(req,res){
		packages.index(req,res)});
	// get the new package form
	app.get('/api/packages/new', function(req,res){
		packages.new(req,res)});
	// post the new package form and create the new package
	app.post('/api/packages', function(req,res){
		packages.create(req,res)});
	// get the page for a specific package
	app.get('/api/packages/:id', function(req,res){
		packages.show(req,res)});
	// update a single package
	app.post('/api/packages/:id', function(req,res){
		packages.update(req,res)});
	app.get('/packages/:id', function(req,res){
		packages.edit(req,res)});
	//filtering the packages according to the categories
	app.post('/api/get_selected_packages', function(req, res){
		packages.get_selected(req,res)
	});
	//removing a package from the DB
	app.get('/api/remove_package/:id', function(req, res){
		packages.remove_package(req, res)
	})


	// CATEGORIES //
	// get all categories to populate the (updateable) category drop-down
	app.get('/api/categories', function(req,res){
		categories.index(req,res)});
	// post a new category
	app.post('/api/categories', function(req,res){
		categories.create(req,res)});




	// BIDS //
	// get the index page of all bids //
	app.get('/api/bids', function(req,res){
		bids.index(req,res)}); //

	// post a bid //
	app.post('/api/bids', function(req,res){
		bids.create(req,res)});



	// USERS //
	// get the index page of all users
	app.get('/api/users', function(req,res){
		users.index(req,res)});
	// get the new user registration form
	app.get('/api/users_login', function(req,res){
		users.new(req,res)});
	// post the new user form and create that new user (Registration)
	app.post('/api/users', function(req,res){
		users.create(req,res)});

	// checks if a user is logged in
	app.get('/api/users/loggedin', function(req,res){
		console.log("route in");
		users.loggedin(req,res)});

	// logout a specific user
	app.get('/api/users/logout', function(req,res){
		console.log("route out");
		users.logout(req,res)});

	// post the user login form  (LOGIN)
	app.post('/api/users/login', function(req,res){
		users.login(req,res)});
	// get the page of a specific user
	app.get('/api/users/:id', function(req,res){
		users.show(req,res)});
	// update a specific user (profile/info)
	app.post('/api/users/:id', function(req,res){
		users.update(req,res)});
	// parse through admin changes before update
	app.post('/users/admin_change', function(req,res){
		users.admin_change(req,res)});
	
	//check who is logged in
	app.get('/api/which_user_is_logged_in', function(req, res){
		users.who_is_logged_in(req, res)});
	
	
	/////////  These are the temporary routes from the Bidders' Nav Bar still in production //////////////
	// This was added just for a mock run through with the Foundation ////////
	/*<a href="/items/bidder">Items</a> |
    <a href="/packages/bidder">Packages</a> |
    <a href="/bids/bidder">Bids</a> |
    <a href="/profile/bidder">Profile</a> |
    <a href="/cart/bidder">Cart</a>*/
    app.get('/api/item/bidder', function(req,res){res.render('items')});

    app.get('/api/package/bidder', function(req,res){res.render('packagesBidder')});

    app.get('/api/bid/bidder', function(req,res){res.render('bidderPackages')});

    app.get('/api/profile/bidder', function(req,res){res.render('user')});

    app.get('/api/cart/bidder', function(req,res){res.send('<h1>Bidder Cart at Checkout</h1>')});
    /// DELETE THESE ROUTES AFTER BUILDING BIDDER SCREENS INTO REACT /////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

		// this is CATCH ALL ROUTS server side patch. To solve production error, when fron-end rout doesn't work properly
		app.get('/*', function(req,res){
			res.sendFile(path.join(__dirname, '../../client/build/index.html'))
//res.('/var/www/POTR/client/src/index.js');
			//res.redirect('/');
		});

}  // end of module.exports
