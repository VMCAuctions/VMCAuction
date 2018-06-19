console.log('models/auction.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var auctionSchema = new Schema({
  name: {type: String, required: true},
	startClock: {type: Date, required:true},
	endClock: {type: Date},
	//colors would hold the color related to the auction's theme
	colors: {type: String},
	//picture would hold the picture associated with the auction
	picture: {type: String},
	pin: {type: String},
  _packages: [{type: Number, ref: 'Package'}],
  _items: [{type: Number, ref: 'Item'}],
  _users: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Auction', auctionSchema);
