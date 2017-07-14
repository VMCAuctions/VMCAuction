console.log('routes.js');

var items = require('../controllers/items.js');
var packages = require('../controllers/packages.js');
var users = require('../controllers/users.js');

module.exports = function(app) {

	// ITEMS //
	// get the "hello world page"
	app.get('/', function(req,res){
		items.greet(req,res)});
	// get the index page of all items
	app.get('/items', function(req,res){
  		items.index(req, res)});
	// get the new item form
	app.get('/items/new', function(req,res){
  		items.new(req, res)});
	// post the new item form and create that new item
	app.post('/items', function(req,res){
  		items.create(req, res)});
	app.get('/items/:id', function(req,res){
		items.show(req, res)});




	// PACKAGES //
	// get the index page of all packages //
	app.get('/packages', function(req,res){
		packages.index(req, res)});
	// get the new package form
	app.get('/packages/new', function(req,res){
		packages.new(req,res)});
	// post the new package form and create the new package 
	app.post('/packages', function(req,res){
		packages.create(req, res)});
	// get the page for a specific package
	app.get('/packages/:id', function(req,res){
		packages.show(req, res)});



	// USERS //
	// get the index page of all users
	app.get('/users', function(req,res){
		users.index(req,res)});
	// get the new user registration form
	app.get('/users/new', function(req,res){
		users.new(req, res)});
	// post the new user form and create that new user
	app.post('/users', function(req,res){
		users.create(req, res)});
	// get the page of a specific user
	app.get('/users/:id', function(req,res){
		users.show(req, res)});
  
}  // end of module.exports

// importing from react to make our routes /////////////////

// // src/routes.js
// import React from 'react'
// import { Route, IndexRoute } from 'react-router'
// import Layout from './components/Layout';
// import IndexPage from './components/IndexPage';
// import AthletePage from './components/AthletePage';
// import NotFoundPage from './components/NotFoundPage';

// const routes = (
//   <Route path="/" component={Layout}>
//     <IndexRoute component={IndexPage}/>
//     <Route path="athlete/:id" component={AthletePage}/>
//     <Route path="*" component={NotFoundPage}/>
//   </Route>
// );

// export default routes;
//////////////////////////////////////////////


////////////////////////////////////////////////
// define the JavaScript logic that initializes the whole app in the browser:
// // src/app-client.js
// import React from 'react';
// import ReactDOM from 'react-dom';
// import AppRoutes from './components/AppRoutes';

// window.onload = () => {
//   ReactDOM.render(<AppRoutes/>, document.getElementById('main'));
// };
///////////////////////////////////////////