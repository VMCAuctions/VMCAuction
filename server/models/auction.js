console.log('models/auction.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var auctionSchema = new Schema({
	name: {type: String, required: true},
	// will be used to replace auction._id hash string in URLs with text stub of auction name
	urlStub: {type: String},
	//the subtitle or the tagline is the place for a catchy phrase for the auction
	subtitle: {type: String},
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
	organization: {type: String},
	taxID: {type: String},
	businessAddress: {type: String},
	pin: {type: String},
  _packages: [{type: Number, ref: 'Package'}],
  _items: [{type: Number, ref: 'Item'}],
  _users: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Auction', auctionSchema);
