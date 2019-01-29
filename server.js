////  CONTAINS SERVER.JS CODE FROM ORIGINAL VMCAuction/server/server.js


var express = require("express");
var app = express();
var session = require('express-session');
var secret = require('./server/config/secret.json')
require('jsdom-global');
require("pdfmake/build/pdfmake.js");
require("pdfmake/build/vfs_fonts.js");

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;


// Test change for github branch serverjs

app.use(session({
  secret: secret.secret,
  resave: false,
  saveUninitialized: true,
  rolling: true
	//resets session timeout everytime the user interacts with the site
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var path = require("path");
app.use(express.static("./public"));

if (process.env.NODE_ENV === "production") {
		app.use(express.static(path.join(__dirname, "/wireframe")));
}else{
		app.use(express.static(path.join(__dirname, "/wireframe")));
}

app.set('views', path.join(__dirname, './wireframe'));
app.set('view engine', 'ejs');

require('./server/config/mongoose.js');
require('./server/config/initialize.js');

var routesSetter = require('./server/config/routes.js');
routesSetter(app);


var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
 console.log("listening on port "+port);
})

