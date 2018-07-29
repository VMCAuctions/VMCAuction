console.log('mongo connection, mongoose setup');
// All callbacks in Mongoose use the pattern: callback(error, result). If an error occurs executing the query,
// the error parameter will contain an error document, and result will be null.
// If the query is successful, the error parameter will be null, and the result will be populated with the results of the query.

//This file is complete other than changing our DB
var mongoose      = require('mongoose'),
/*
*  require file-system so that we can load, read, require all of the model files
*/
    fs            = require('fs'),
/*
*  utilize path for easy dir/file joining
*/
    path          = require('path'),
/*
*  Dir where our models are located
*/
    models_path   = path.join( __dirname, "../models"),
/*
*   Regular expression that checks for .js extension
*/
    reg           = new RegExp( ".js$", "i" ),
/*
*  database information
*/
    // dbURI         = 'mongodb://localhost/POTR_DEV2' || '127.0.0.1:27017',

    //Note to Self: Switching to Dev3 for temporary testing purposes
    dbURI         = 'mongodb://localhost/POTR_DEV3',

    // require auto-increment for simple, readable ID's
    autoIncrement = require('mongoose-auto-increment');
/*
* Connect to the database
*/
var connection = mongoose.connect( dbURI );

// initialize auto-increment
autoIncrement.initialize(connection);
/*
*  CONNECTION EVENTS
*  When successfully connected
*/
mongoose.connection.on( 'connected', function () {
  console.log( `Mongoose default connection open to ${ dbURI }` );
});
/*
*  If the connection throws an error
*/
mongoose.connection.on( 'error', function ( err ) {
  console.error( `Mongoose default connection error: ${ err }` );
});
/*
*  When the connection is disconnected
*/
mongoose.connection.on( 'disconnected', function () {
  console.log( 'Mongoose default connection disconnected' );
});
/*
*  If the Node process ends, close the Mongoose connection
*/
process.on( 'SIGINT', function() {
  mongoose.connection.close( function () {
    console.log( 'Mongoose default connection disconnected through app termination' );
    process.exit( 0 );
  });
});
/*
*  read all of the files in the models dir and
*  check if it is a javascript file before requiring it
*/
fs.readdirSync( models_path ).forEach( function( file ) {
  if( reg.test( file ) ) {
    require( path.join( models_path, file ) );
  }
});
