
var express = require("express");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:true}));


var path = require("path");
// static content 
app.use(express.static(path.join(__dirname, "./client")));

// app.set('views', path.join(__dirname, './views'));


var routes_setter = require('./server/config/routes.js');
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