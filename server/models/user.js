console.log('models/user.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var userSchema = new Schema({
	userName: {type: String, required: true, minlength: 3},
	firstName: {type: String, required: true, minlength: 3},
	lastName: {type: String, required: true, minlength: 3},
	phone: {type: String, required: true},
	email: {type: String, required: true},
	streetAddress: {type: String, required: true},
	city: {type: String, required: true},
	states: {type: String, required: true},
	zip: {type: String, required: true},
	password: {type: String, required: true, minlength: 8},
	// leave mailing address out as this would be entered through the payment API?  Foundation wants users to enter info only once
	cc_token: String,
	_bids: [{type: Schema.Types.ObjectId, ref: 'Bid'}],
	admin: {type: Boolean, default: false}
})



module.exports = 	mongoose.model('User', userSchema);
