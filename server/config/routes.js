var items = require('../controllers/items.js');
var packages = require('../controllers/packages.js');
var users = require('../controllers/users.js');
var categories = require('../controllers/categories.js')
var auctions = require('../controllers/auctions.js')

// var path = require("path");
var express = require("express");
// var app = express();
// app.use(express.static("../wireframe"));

var router = express.Router()

module.exports = function(app) {

	// ITEMS //
	// Renders all items page
	app.get('/:auctions/items', function(req,res){
		items.index(req,res)});
	// get the new item form
	app.get('/:auctions/items/new', function(req,res){
		items.new(req,res)});
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
	// show all packages
	app.get('/:auctions/packages', function(req,res){
		packages.index(req,res)});
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



	// USERS //
	// get the index page of all users
	app.get('/:auctions/users', function(req,res){
		users.index(req,res)});
	// displaying the create user page
	app.get('/:auctions/users/register', function(req,res) {
		users.register(req,res)});
	// get the login form
	app.get('/:auctions/users/login', function(req,res){
		users.new(req,res)});
	// post the new user form and create that new user (Registration)
	app.post('/:auctions/users', function(req,res){
		users.create(req,res)});
  	//Check login credentials
	app.post('/:auctions/users/checklogin', function(req,res){
		users.checkLogin(req,res)});
  	//Check if username is already in use
	app.get('/:auctions/users/duplicate/', function(req, res) {
		users.duplicate(req,res)});
	// logout a specific user
	app.get('/:auctions/users/logout', function(req,res){
		console.log("route out");
		users.logout(req,res)});
	// post the user login form  (LOGIN)
	app.post('/:auctions/users/login', function(req,res){
		users.login(req,res)});
	// get the page of a specific user
	app.get('/:auctions/users/:userName', function(req,res){
		users.show(req,res)});
	// update a specific user (profile/info)
	app.post('/:auctions/users/:id(\d+)', function(req,res){
		users.update(req,res)});
	// parse through admin changes before update
	app.post('/:auctions/users/admin', function(req,res){
		users.adminChange(req,res)});
  	//adds to watchlist
	app.get('/:auctions/users/interested/:id', function(req, res) {
		users.interested(req, res)});
	//removes from watchlist
	app.get('/:auctions/users/uninterested/:id', function (req,res) {
		users.uninterested(req, res)});
  	//saves list of packages on users personal page as user likes it
	app.get('/:auctions/users/updateList/:result/:userId', function(req,res){
		users.updateList(req,res)});

	// AUCTION //
		//admin selects what they want to do
	app.get('^/auctions$', function (req, res) {
		auctions.index(req, res)});
	app.post('^/auctions$', function (req, res) {
		auctions.create(req, res)});

	//Landing Page (Packages page)
	app.get('/:auctions', function (req,res) {
		packages.index(req,res)});

}
// end of module.exports
