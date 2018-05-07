console.log('models/package.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;



var packageSchema = new Schema({
	name: {type: String, required: true, minlength: 4},
	_items: [{type: Number, required: true, ref: 'Item'}],
	description: {type: String},
	_category: String,
	_auctions: {type: Schema.Types.ObjectId, ref: 'Auction'},
	value: Number,  //prepopulated field with for item in package._items { value += item.value }
	amount: Number, //starting bid
	priority: {type: Number, required: true, default: 0},
	featured: Boolean,
	bidIncrement: Number,
	bids: {type: Array},
	// {bidAmount: 50, name: yarik }
	photo: String
}, { timestamps: true });

packageSchema.plugin(autoIncrement.plugin, {model: 'Package', startAt: 100});

module.exports = mongoose.model('Package', packageSchema);
