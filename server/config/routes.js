var items = require('../controllers/items.js');
var packages = require('../controllers/packages.js');
var users = require('../controllers/users.js');
var categories = require('../controllers/categories.js');
var auctions = require('../controllers/auctions.js');


module.exports = function(app) {

	// ITEMS //
	// Renders all items page
	app.get('/:auctions/items', function(req,res){
		items.index(req,res)});
	// get the new item form
	app.get('/:auctions/items/new', function(req,res){
		items.new(req,res)});

	//adding items from csv page
	app.get('/:auctions/items/populate', function(req, res){
		items.populatePage(req, res)});
	//actually adding items from csv
	app.post('/:auctions/items/populate', function(req, res){
		console.log("in items.populate route")
		items.populate(req, res)});

	// post the new item form and create that new item
	app.post('/:auctions/items', function(req,res){
		items.create(req,res)});
	// Edit item form
	app.get('/:auctions/items/:id', function(req,res){
		items.edit(req,res)});
	// update a single item
	app.post('/:auctions/items/:id', function(req,res){
		items.update(req,res)});
	//deleting an item
	app.get('/:auctions/items/remove/:id', function(req, res){
		items.removeItem(req, res)});


	// PACKAGES //
	//Modifying the featured status and priority of an item
	app.get('/:auctions/packages/priority/:id/:featured/:priority', function(req, res){
		packages.priority(req, res)});

	// show all packages
	app.get('/:auctions/packages', function(req,res){
		console.log("150 routes.js /:auctions/packages.  req.params = ",req.params)
		console.log("151 routes.js /:auctions/packages.  req.body = ",req.body)
		packages.index(req,res)});


	// show package register
	app.get('/:auctions/packages/list', function(req, res) {
		packages.list(req, res)});
	// get the new package form
	app.get('/:auctions/packages/new', function(req,res){
		packages.new(req,res)});
	// post the new package form and create the new package
	app.post('/:auctions/packages', function(req,res){
		packages.create(req,res)});
	// get the page for a specific package
	app.get('/:auctions/packages/:id', function(req,res){
		packages.show(req,res)});
	// update a single package
	app.post('/:auctions/packages/:id', function(req,res){
		packages.update(req,res)});
  	// get the edit package form
	app.get('/:auctions/packages/edit/:id', function(req,res){
		packages.edit(req,res)});
	//removing a package from the DB
	app.get('/:auctions/packages/remove/:id', function(req, res){
		packages.removePackage(req, res)});
	//removes last bid on package
	app.post('/:auctions/packages/cancelbid/:id', function(req,res){
		packages.cancelBid(req,res)});
	//makes a package featured (toggle on or off)
	app.get('/:auctions/packages/featured/:id', function(req, res) {
		packages.featured(req, res)});



	// CATEGORIES //
	// get all categories to populate the (updateable) category drop-down
	app.get('/:auctions/categories', function(req,res){
		categories.index(req,res)});
	// post a new category
	app.post('/:auctions/categories', function(req,res){
		categories.create(req,res)});

	// delete a category
	app.get('/:auctions/categories/:_id/delete', function(req,res){
		categories.delete(req,res)});



	// USERS //
	// get the index page of all users
	app.get('/:auctions/users', function(req,res){
		users.index(req,res)});
	// displaying the create user page
	app.get('/users/register', function(req,res) {
		console.log('routes.js users/register');
		users.register(req,res)});
	// get the login form
	app.get('/users/login', function(req,res){
		console.log('routes.js users/login');
		users.login(req,res)});

	//get the user account page
	app.get('/:auctions/users/account/:userName', function (req,res) {
		users.showAccount(req,res)});

	// post the new user form and create that new user (Registration)
	app.post('/users/create', function(req,res){
		users.create(req,res)});


  	//Check login credentials
	app.post('/users/checklogin', function(req,res){
	// app.post('/checklogin', function(req,res){
		users.checkLogin(req,res)});
  	
	  
	  
	  //Check if username is already in use
	app.get('/users/duplicate/', function(req,res) {
		users.duplicate(req,res)});
	// logout a specific user
	app.get('/users/logout', function(req,res){
		console.log("route out");
		users.logout(req,res)});
	// get the watchlist page of a specific user
	app.get('/:auctions/users/:userName', function(req,res){
		users.show(req,res)});

	//update organizer's data - TODO!
	app.post('/:auctions/users/account/:userName', function(req, res){
		users.update(req, res)});

	// update a specific user (profile/info)- this function might be replaced by the one above
	app.put('/:auctions/users/:id(\d+)', function(req,res){
		users.update(req,res)});

	// parse through admin changes before update
	app.post('/users/admin', function(req,res){
		users.adminChange(req,res)});
	// displays user cart info
	app.get('^/users/admin$', function(req,res){
		users.admin(req,res)});
  	//adds to watchlist
	app.get('/:auctions/users/interested/:id', function(req, res) {
		users.interested(req, res)});
	//removes from watchlist
	app.get('/:auctions/users/uninterested/:id', function (req,res) {
		users.uninterested(req, res)});
  	//saves list of packages on users personal page as user likes it
	app.get('/:auctions/users/updateList/:result/:userId', function(req,res){
		users.updateList(req,res)});
		//deletes a user (Note: no front-end link to this route yet)
	app.get('/users/delete/:user', function(req, res){
		users.delete(req,res)});

	// AUCTION //
	//Organizer's landing page (where the organizer selects what she wants to do)
	app.get('^/auctions/main', function (req, res) {
		auctions.main(req, res)});
	//This is the page with the form for creating a new auction
	app.get('^/auctions$', function (req, res) {
		auctions.index(req, res)});
	//Creating an auction
	app.post('^/auctions$', function (req, res) {
		auctions.create(req, res)});
	//Renders the organizer menu page
	app.get('/:auctions/organizerMenu', function (req, res) {
		auctions.menu(req, res)});
	//Renders the page to edit an auction
	app.get('/:auctions/edit', function (req, res) {
		auctions.edit(req, res)})
		//Actually edits the auction on the backend
	app.post('/:auctions/update', function(req,res){
		auctions.update(req, res)})
		// Deletes auction
	app.get('/:auctions/remove', function(req, res) {
		auctions.deleteAuction(req, res)});
	//Event landing page the supporters will see; has links to supporter login and registration
	app.get('/:auctions/event', function(req, res) {
		auctions.event(req, res)});
	// Clerk landing page that summarizes users, packages won, items contained, and hopefully and invoice
	app.get('/:auctions/clerkDash', function(req,res) {
		auctions.clerk(req,res)});
	app.get('/clerk/login', function(req, res){
		auctions.pinEntry(req,res)});
	app.post('/clerk/pin', function(req, res){
		auctions.pinCheck(req,res)});



	//Landing Page (Packages page)
	app.get('/:auctions/*', function (req,res) {
		packages.index(req,res)});
	//Added temporary redirect if no other routes are hit, which goes to login
	app.get('*', function (req, res) {
		console.log('routes.js * route.  directs to /users/login');
		res.redirect('/users/login')
	})
}
// end of module.exports
