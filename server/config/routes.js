console.log('routes.js');

var items = require('../controllers/items.js');
var packages = require('../controllers/packages.js');
var users = require('../controllers/users.js');
var categories = require('../controllers/categories.js')

module.exports = function(app) {

	// get the Login/Registration screen.  This is our root route //
	app.get('/', function(req,res){
		users.welcome(req,res)});

	// ITEMS //
	// get the index page of all items
	app.get('/items', function(req,res){
		items.index(req,res)});
	// get the new item form
	app.get('/items/new', function(req,res){
		items.new(req,res)});
	// post the new item form and create that new item
	app.post('/items', function(req,res){
		items.create(req,res)});
	// show a single item (might be handled solely by React)
	app.get('/items/:id', function(req,res){
		items.show(req,res)});
	// update a single item
	app.post('/items/:id', function(req,res){
		items.update(req,res)});




	// PACKAGES //
	// get the index page of all packages
	app.get('/packages', function(req,res){
		packages.index(req,res)});
	// get the new package form
	app.get('/packages/new', function(req,res){
		packages.new(req,res)});
	// post the new package form and create the new package
	app.post('/packages', function(req,res){
		packages.create(req,res)});
	// get the page for a specific package
	app.get('/packages/:id', function(req,res){
		packages.show(req,res)});
	// update a single package
	app.post('/packages/:id', function(req,res){
		packages.update(req,res)});
	//filtering the packages according to the categories
	app.post('/get_selected_packages', function(req, res){
		packages.get_selected(req,res)
	});
	//removing a package from the DB
	app.post('/remove_package', function(req, res){
		packages.remove_package(req, res)
	})


	// CATEGORIES //
	// get all categories to populate the (updateable) category drop-down
	app.get('/categories', function(req,res){
		categories.index(req,res)});
	// post a new category
	app.post('/categories', function(req,res){
		categories.create(req,res)});




	// BIDS //
	// get the index page of all bids //
	app.get('/bids', function(req,res){
		bids.index(req,res)}); //

	// post a bid //
	app.post('/bids', function(req,res){
		bids.create(req,res)});



	// USERS //
	// get the index page of all users
	app.get('/users', function(req,res){
		users.index(req,res)});
	// get the new user registration form
	app.get('/users/new', function(req,res){
		users.new(req,res)});
	// post the new user form and create that new user (Registration)
	app.post('/users', function(req,res){
		users.create(req,res)});

	// checks if a user is logged in
	app.get('/users/loggedin', function(req,res){
		console.log("reached /users/loggedin in routes")
		users.loggedin(req,res)});

	// logout a specific user
	app.get('/users/logout', function(req,res){
		console.log("reached /users/logout in routes")
		users.logout(req,res)});

	// post the user login form  (LOGIN)
	app.post('/users/:id/login', function(req,res){
		users.login(req,res)});
	// get the page of a specific user
	app.get('/users/:id', function(req,res){
		console.log(req.param.id);
		users.show(req,res)});
	// update a specific user (profile/info)
	app.post('/users/:id', function(req,res){
		users.update(req,res)});
	
	//check who is logged in
	app.get('/which_user_is_logged_in', function(req, res){
		users.who_is_logged_in(req, res)});

	/////////  These are the temporary routes from the Bidders' Nav Bar still in production //////////////
	// This was added just for a mock run through with the Foundation ////////
	/*<a href="/items/bidder">Items</a> |
    <a href="/packages/bidder">Packages</a> |
    <a href="/bids/bidder">Bids</a> |
    <a href="/profile/bidder">Profile</a> |
    <a href="/cart/bidder">Cart</a>*/
    app.get('/item/bidder', function(req,res){res.render('items')});

    app.get('/package/bidder', function(req,res){res.render('packagesBidder')});

    app.get('/bid/bidder', function(req,res){res.render('bidderPackages')});

    app.get('/profile/bidder', function(req,res){res.render('user')});

    app.get('/cart/bidder', function(req,res){res.send('<h1>Bidder Cart at Checkout</h1>')});
    /// DELETE THESE ROUTES AFTER BUILDING BIDDER SCREENS INTO REACT /////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

}  // end of module.exports
