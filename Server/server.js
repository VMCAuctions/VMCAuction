
var express = require("express");
var app = express();

var React = require('../client/node_modules/react');  
// var jsx = require('node-jsx');
// jsx.intall();

var bodyParser = require('body-parser');
app.use(bodyParser.json());


var path = require("path");


// static content 

app.use(express.static(path.join(__dirname, "../client/public")));
// app.set('views', path.join(__dirname, '../client/frontend/public'));
// app.set('views', path.join(__dirname, './views'));
app.set('views', path.join(__dirname, '../wireframe'));
app.set('view engine', 'ejs');


// require the mongoose configuration file which does the rest for us
//////  REMEMBER TO GO TO "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" /////////
require('./config/mongoose.js');

var routes_setter = require('./config/routes.js');
routes_setter(app);


// tell the express app to listen on port 8000
var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
 console.log("listening on port "+port);
})


var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	console.log('using sockets');
	console.log(socket.id);
	//all the socket code goes in here!
	socket.on('posting_form', function(data){
		console.log(data.form);
		socket.emit('server_response', {response: 'back from the server',
			name: data.name}
		);
	});
})
