console.log('models/auction.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var auctionSchema = new Schema({
  name: {type: String, required: true},
  _packages: [{type: Number, ref: 'Package'}],
  _items: [{type: Number, ref: 'Item'}],
  _users: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Auction', auctionSchema);
