console.log('models/address.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var addressSchema = new Schema({
	street: String,
	apartment: String,
	city: String,
	state: String,
	zip: String
})



module.exports = 	mongoose.model('Address', addressSchema);