console.log('models/package.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;



var packageSchema = new Schema({

	// took out all 'required = true' validations except for name
	name: {type: String, required: true, minlength: 4},
	_items: [{type: Number, ref: 'Item'}],
	description: {type: String},
	_category: {type: String},

	//for testing package create/edit category comma snafu
	cat: {type: String},
	
	_auctions: {type: Schema.Types.ObjectId, ref: 'Auction'},
	value: {type: Number},  //prepopulated field with for item in package._items { value += item.value }
	amount: {type: Number}, //starting bid
	priority: {type: Number, default: -1}, //varies from 1 - 10, with 1 first
	featured: {type: Boolean},
	bidIncrement: {type: Number},
	bids: {type: Array},
	// {bidAmount: 50, name: yarik }
	photo: String,
	restrictions: { type: String }

	// original fields
	// name: {type: String, required: true, minlength: 4},
	// _items: [{type: Number, required: true, ref: 'Item'}],
	// description: {type: String, required: true},
	// _category: {type: String, required: true},
	// _auctions: {type: Schema.Types.ObjectId, required: true, ref: 'Auction'},
	// value: {type: Number, required: true},  //prepopulated field with for item in package._items { value += item.value }
	// amount: {type: Number, required: true}, //starting bid
	// priority: {type: Number, default: -1}, //varies from 1 - 10, with 1 first
	// featured: {type: Boolean, required: true},
	// bidIncrement: {type: Number, required: true},
	// bids: {type: Array},
	// // {bidAmount: 50, name: yarik }
	// photo: String,
	// restrictions: { type: String }



}, { timestamps: true, usePushEach: true });

packageSchema.plugin(autoIncrement.plugin, {model: 'Package', startAt: 100});

module.exports = mongoose.model('Package', packageSchema);
