console.log('models/auction.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// COMMENTING OUT ALL MONGOOSE-UNIQUE-VALIDATOR CODE UNTIL ERROR RESOLVED
// used on 'name' field to force uniqueness
// var uniqueValidator = require('mongoose-unique-validator');

var auctionSchema = new Schema({
	// name: {type: String, required: true, unique: true },
	name: {type: String, required: true},

	//the subtitle or the tagline is the place for a catchy phrase for the auction
	subtitle: {type: String},
	// auction name converted to lowercase and with dashes replacing spaces.  used for routes/URLs
	urlStub: {type: String},
	welcomeMessage: {type: String},
	description: {type: String},
	venue: {type: String},
	startClock: {type: Date, required:true},
	endClock: {type: Date},
	//colors would hold the color related to the auction's theme
	colors: {type: String},
	//headerImage would hold the header image associated with the auction landing page
	headerImage: {type: String},
	//in case a logo or symbol image is used for an auction
	auctionlogo: {type: String},
	pin: {type: String},
	_packages: [{type: Number, ref: 'Package'}],
	_items: [{type: Number, ref: 'Item'}],
	_users: {type: Schema.Types.ObjectId, ref: 'User'}
})

// activates uniqueValidator plugin
// auctionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Auction', auctionSchema);
