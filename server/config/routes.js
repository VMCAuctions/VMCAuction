var items = require('../controllers/items.js');
var packages = require('../controllers/packages.js');
var users = require('../controllers/users.js');
var categories = require('../controllers/categories.js')
var path = require("path");

// var express = require("express");
// var app = express();
//
// app.use(express.static("../wireframe"));


module.exports = function(app) {

	//Landing Page (Packages page)
	app.get('/', function (req,res) {
		packages.index(req,res)});



	// ITEMS //
	// Renders all items page
	app.get('/items', function(req,res){
		items.index(req,res)});
	// get the new item form
	app.get('/items/new', function(req,res){
		items.new(req,res)});
	// post the new item form and create that new item
	app.post('/items', function(req,res){
		items.create(req,res)});
	// Edit item form
	app.get('/items/:id', function(req,res){
		items.edit(req,res)});
	// update a single item
	app.post('/items/:id', function(req,res){
		items.update(req,res)});
	//deleting an item
	app.get('/items/remove/:id', function(req, res){
		items.removeItem(req, res)});



	// PACKAGES //
	// show all packages
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
  	// get the edit package form
	app.get('/packages/edit/:id', function(req,res){
		packages.edit(req,res)});
	//removing a package from the DB
	app.get('/packages/remove/:id', function(req, res){
		packages.removePackage(req, res)});
	//removes last bid on package
	app.post('/packages/cancelbid/:id', function(req,res){
		packages.cancelBid(req,res)});
	//makes a package featured (toggle on or off)
	app.get('/packages/featured/:id', function(req, res) {
		packages.featured(req, res)});



	// CATEGORIES //
	// get all categories to populate the (updateable) category drop-down
	app.get('/categories', function(req,res){
		categories.index(req,res)});
	// post a new category
	app.post('/categories', function(req,res){
		categories.create(req,res)});



	// USERS //
	// get the index page of all users
	app.get('/users', function(req,res){
		users.index(req,res)});
	// displaying the create user page
	app.get('/users/register', function(req,res) {
		users.register(req,res)});
	// get the login form
	app.get('/users/login', function(req,res){
		users.new(req,res)});
	// post the new user form and create that new user (Registration)
	app.post('/users', function(req,res){
		users.create(req,res)});
  	//Check login credentials
	app.post('/users/checklogin', function(req,res){
		users.checkLogin(req,res)});
  	//Check if username is already in use
	app.get('/users/duplicate/', function(req, res) {
		users.duplicate(req,res)});
	// logout a specific user
	app.get('/users/logout', function(req,res){
		console.log("route out");
		users.logout(req,res)});
	// post the user login form  (LOGIN)
	app.post('/users/login', function(req,res){
		users.login(req,res)});
	// get the page of a specific user
	app.get('/users/:userName', function(req,res){
		users.show(req,res)});
	// update a specific user (profile/info)
	app.post('/users/:id(\d+)', function(req,res){
		users.update(req,res)});
	// parse through admin changes before update
	app.post('/users/admin', function(req,res){
		users.adminChange(req,res)});
  	//adds to watchlist
	app.get('/users/interested/:id', function(req, res) {
		users.interested(req, res)});
	//removes from watchlist
	app.get('/users/uninterested/:id', function (req,res) {
		users.uninterested(req, res)});
  	//saves list of packages on users personal page as user likes it
	app.get('/users/updateList/:result/:userId', function(req,res){
		users.updateList(req,res)});

}
// end of module.exports
