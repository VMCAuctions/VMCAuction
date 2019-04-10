var items = require('../controllers/items.js');
var packages = require('../controllers/packages.js');
var users = require('../controllers/users.js');
var categories = require('../controllers/categories.js');
var auctions = require('../controllers/auctions.js');

var path = require('path')
Auction = require("../models/auction.js");

var widgets = require('../controllers/widgets.js');
Widget = require("../models/widget.js");

// for image upload
var multer = require('multer')

module.exports = function(app) {

	var storage = multer.diskStorage({
		destination: function(req, file, callback) {
			// console.log(Date.now() + " - 000 routes.js var storage. in destination")
			callback(null, './public')//here you can place your destination path
		},
	
		filename: function(req, file, callback) {
			// console.log(Date.now() + " - 001 routes.js var storage.  file = ",file)
			// console.log(Date.now() + " - 002 routes.js var storage.  req.file = ",req.file)
			// console.log(Date.now() + " - 003 routes.js var storage.  req.body = ",req.body)

			// Creates text stub for URL, auction image name and package image name

			// converts 'name' to all lower case 
			var lowerName = req.body.name.toLowerCase();
			// console.log("150 routes.js var storage.  var lowerName = ",lowerName)

			// converts spaces to dashes for use in URLStub
			var urlStub = '';
			for (var i = 0; i < lowerName.length; i++){
				var code = lowerName.charCodeAt(i);
				// console.log("151 routes.js var storage.  var code = ",code)
				// console.log("152 routes.js var storage.  String.fromCharCode(code) = ",String.fromCharCode(code))
				if (code == 32){
					code = 45;
					urlStub += String.fromCharCode(code);
					// console.log("154 routes.js var storage.  lowerName letter (= s/b dash) = ",String.fromCharCode(code))
				} else if (code >= 97 && code <= 122) {
					// console.log("155 routes.js var storage.  code = ",code)
					// console.log("156 routes.js var storage.  String.fromCharCode(code) = ",String.fromCharCode(code))
					urlStub += String.fromCharCode(code);
				} else console.log("157 routes.js var storage.Code not in lower-case range 97-122.  Code = ",code)
				// console.log("158 routes.js var storage. urlStub final = ",urlStub)

			}


			// var imgFileName = file.fieldname + '-' + req.body.name + '-' + Date.now() + path.extname(file.originalname);
			var imgFileName = file.fieldname + '_' + urlStub + '_' + Date.now() + path.extname(file.originalname);
			req.body.imgFileName = imgFileName;
			req.body.urlStub = urlStub;
			// console.log(Date.now() + " - 004 routes.js var storage.  imgFileName = ",imgFileName)
			// console.log(Date.now() + " - 005 routes.js var storage.  urlStub = ",urlStub)
			
			callback(null, imgFileName)
		}
	})

	var csvStorage = multer.diskStorage({
		destination: function(req, file, callback) {
			// console.log("000 routes.js var csvStorage. in destination")
			callback(null, './public')//here you can place your destination path
		},
	
		filename: function(req, file, callback) {
			// console.log("001 routes.js var csvStorage.  file = ",file)
			// console.log("002 routes.js var csvStorage.  req.file = ",req.file)
			// console.log("003 routes.js var csvStorage.  req.body = ",req.body)
			
			var csvFileName = file.originalname;
			req.body.csvFileName = csvFileName;
			// console.log("004 routes.js var storage.  csvFileName = ",csvFileName)
			
			callback(null, csvFileName)
		}
	})

	// Renders widget create page
	app.get('/widget', function(req,res){
		widgets.index(req,res)});


	//WIDGETS
	app.post('^/widgets$', function (req, res) {

		// console.log(Date.now()," - 100 routes.js /widgets$.  req.body = ",req.body);
		// console.log(Date.now()," - 101 routes.js /widgets$.  req.file = ",req.file);
		
		var upload = multer({ storage: storage}).single('widgetImage');
		upload(req, res, function(err) {
			// console.log(Date.now()," - 102 routes.js /widgets$.  req.body = ",req.body);
			// console.log(Date.now()," - 103 routes.js /widgets$.  req.file = ",req.file);
			widgets.create(req, res)});
	})
		// widgets.create(req, res)});
	

	// ITEMS //
	// Renders all items page
	app.get('/:auctions/items', function(req,res){
		items.index(req,res)});
	// get the new item form
	app.get('/:auctions/items/new', function(req,res){
		items.new(req,res)});


	// Bob
	//displays add items from csv html page
	app.get('/:auctions/items/csv', function(req, res){
		// console.log("200 routes.js /:auc./items/csv route")
		items.populateCsv(req, res)});

	// actually adding items from csv - original
	// app.post('/:auctions/items/itemsCsv', function(req, res){
	// 	// console.log("201 routes.js /:auc./items/itemsCsv route")
	// 	items.itemsCsv(req, res)});

	// actually adding items from csv - with .csv file path save
	app.post('/:auctions/items/itemsCsv', function(req, res){
		// console.log("110 routes.js /:aucs/items/itemsCsv.  req.body = ",req.body);
		// console.log("111 routes.js /:aucs/items/itemsCsv.  req.file = ",req.file);
		
		var upload = multer({ storage: csvStorage}).single('csvUpload');
		upload(req, res, function(err) {
			// console.log("112 routes.js /:aucs/items/itemsCsv.  req.body = ",req.body);
			// console.log("113 routes.js /:aucs/items/itemsCsv.  req.file = ",req.file);
			
			items.itemsCsv(req, res)});

	})
		// items.itemsCsv(req, res)});



	
	// existing methods
	//adding items from csv page
	app.get('/:auctions/items/populate', function(req, res){
		items.populatePage(req, res)});

	//actually adding items from csv
	app.post('/:auctions/items/populate', function(req, res){
		// console.log("201 routes.js /:auc./itemsCsv/populate route")
		items.populate(req, res)});

	// end csv upload	

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
	// show catalog (all packages)
	app.get('/:auctions/packages', function(req,res){
		packages.index(req,res)});
	// show featured packages
	app.get('/:auctions/featured-packages', function(req,res){
		packages.featuredPackages(req,res)});
	// show package register
	app.get('/:auctions/packages/list', function(req, res) {
		packages.list(req, res)});
	// get the new package form
	app.get('/:auctions/packages/new', function(req,res){
		packages.new(req,res)});


	// post the new package form and create the new package - ORIGINAL
	// app.post('/:auctions/packages', function(req,res){
	// 	packages.create(req,res)});

	// post the new package form and create the new package - with image upload
	app.post('/:auctions/packages', function (req, res) {

		// console.log(Date.now()," - 020 routes.js /:auctions/pkgs.  req.body = ",req.body);
		// console.log(Date.now()," - 021 routes.js /:auctions/pkgs.  req.file = ",req.file);
		
		var upload = multer({ storage: storage}).single('packageImage');
		upload(req, res, function(err) {
			// console.log(Date.now()," - 022 routes.js /:auctions/pkgs.  req.body = ",req.body);
			// console.log(Date.now()," - 023 routes.js /:auctions/pkgs.  req.file = ",req.file);
			packages.create(req, res)});
			
		})

	// get the page for a specific package
	app.get('/:auctions/packages/:id', function(req,res){
		packages.show(req,res)});

	// update a single package
	app.post('/:auctions/packages/items/:id', function(req,res){

		console.log(Date.now()," - 040 routes.js /:aucs/pkgs/items/:id.  req.body = ",req.body);
		
		packages.itemsUpdate(req, res)});
	
	app.post('/:auctions/packages/:id', function(req,res){

		// console.log(Date.now()," - 030 routes.js /:aucs/pkgs/:id.  req.body = ",req.body);
		// console.log(Date.now()," - 031 routes.js /:aucs/pkgs/:id.  req.file = ",req.file);
		
		var upload = multer({ storage: storage}).single('packageImage');
		upload(req, res, function(err) {
			// console.log(Date.now()," - 032 routes.js /:aucs/pkgs/:id.  req.body = ",req.body);
			// console.log(Date.now()," - 033 routes.js /:aucs/pkgs/:id.  req.file = ",req.file);
			packages.update(req, res)});
		})
	

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

	//TO BE ADDED (a page just for the featured pacakges):	
	app.get('/:auctions/featured-packages', function(req, res) {
		packages.featuredPackages(req, res)});	

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

	// get the new supporter form
	app.get('/:auctions/users/new', function (req,res) {
		users.new(req,res)});

	// post the new user form and create that new user (Registration)
	app.post('/users/create', function(req,res){
		users.create(req,res)});

	// Supporters .csv import
	//displays add supporters from csv html page
	app.get('/:auctions/users/csv', function(req, res){
		console.log("200 routes.js /:auc./users/csv route")
		users.supporterCsv(req, res)});

	// actually adding supporters from csv - original
	// app.post('/:auctions/users/usersImport', function(req, res){
	// 	console.log("201 routes.js /:auc./users/supportersCsv route")
	// 	users.usersCsv(req, res)});

	app.post('/:auctions/users/usersImport', function(req, res){
		
		// console.log("110 routes.js /:aucs/users/usersImport.  req.body = ",req.body);
		// console.log("111 routes.js /:aucs/users/usersImport.  req.file = ",req.file);

		var upload = multer({ storage: csvStorage}).single('supporterCsvUpload');
		upload(req, res, function(err) {
			// console.log("112 routes.js /:aucs/users/usersImport.  req.body = ",req.body);
			// console.log("113 routes.js /:aucs/users/usersImport.  req.file = ",req.file);
			
			users.usersCsv(req, res)});

	})


  	//Check login credentials
	app.post('/users/checklogin', function(req,res){
		users.checkLogin(req,res)});

	  //Check if username is already in use
	app.get('/users/duplicate/', function(req,res) {
		users.duplicate(req,res)});
	// logout a specific user
	app.get('/users/logout', function(req,res){
		console.log("route out");
		users.logout(req,res)});
	
	// display the edit supporter page
	app.get('/:auctions/usersAccount/:userName', function(req,res){
		users.showAccount(req,res)});

	// get the watchlist page of a specific user
	app.get('/:auctions/users/:userName', function(req,res){
		users.show(req,res)});

	//update organizer's data - TODO!
	app.post('/:auctions/users/account/:userName', function(req, res){
		users.update(req, res)});

	// Send SMS text link to supporter at auction checkin
	app.post('/users/sendSMS', function(req,res) {
		// console.log("351 routes.js /users/sendSMS  req.body = ",req.body)
		users.sendSMS(req,res)});

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
	app.get('/:auction/users/delete/:id', function(req, res){
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


		// console.log(Date.now()," - 100 routes.js /auctions$.  req.body = ",req.body);
		// console.log(Date.now()," - 101 routes.js /auctions$.  req.file = ",req.file);
		
		var upload = multer({ storage: storage}).single('auctionImage');
		upload(req, res, function(err) {
			// console.log(Date.now()," - 102 routes.js /auctions$.  req.body = ",req.body);
			// console.log(Date.now()," - 103 routes.js /auctions$.  req.file = ",req.file);
			// auctions.create(req, res)});
		})

		auctions.create(req, res)});
	//Renders the Organizer's Menu page, which has been renamed as Auction Menu
	app.get('/:auctions/organizerMenu', function (req, res) {
		auctions.menu(req, res)});

	//Renders the page to edit an auction
	app.get('/:auctions/edit', function (req, res) {
		auctions.edit(req, res)})
	
	//Actually edits the auction on the backend
	app.post('/:auctions/update', function(req,res){

		// console.log(Date.now()," - 110 routes.js /auctions/update.  req.body = ",req.body);
		// console.log(Date.now()," - 111 routes.js /auctions/update.  req.file = ",req.file);

		var upload = multer({ storage: storage}).single('auctionImage');
		upload(req, res, function(err) {
			// console.log(Date.now()," - 112 routes.js /auctions/update.  req.body = ",req.body);
			// console.log(Date.now()," - 113 routes.js /auctions/update.  req.file = ",req.file);
			auctions.update(req, res)})
			
		})
	
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
		console.log('routes.js * route');
		res.redirect('/users/login')
	})
}
// end of module.exports
