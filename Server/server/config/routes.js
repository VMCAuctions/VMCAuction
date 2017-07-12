console.log('routes.js');

var items = require('../controllers/items.js')

module.exports = function(app) {
	app.get('/', function(req,res){
		items.greet(req,res)});
	app.get('/items', function(req,res){
  		items.index(req, res)});
	app.get('/items/new', function(req,res){
  		items.new(req, res)});
	app.post('/items', function(req,res){
  		items.create(req, res)});
  
}  // end of module.exports