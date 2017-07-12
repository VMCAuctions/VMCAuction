console.log('models/package.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;



var packageSchema = new Schema({
 name: {type: String, required: true, minlength: 4},
 _items: [{type: Schema.Types.ObjectId, ref: 'Item', required: true}],
 description: {type: String, maxlength: 250},
 //donor: {type: String, default: 'anonymous'}, // can access donor(s) by looping for item in package._items { item.donor }
 restrictions: {type: String, maxlength: 250},  // maybe prepopulate field with for item in package._items { item.restrictions }
 value: Number,  // maybe prepopulate field with for item in package._items { value += item.value }
 bid: {type: Number, required: true}, // current highest bid, starting with the opening suggested bid
 bid_increment: Number,  // increment is a reserved word, so used bid_increment
 _bidders: [{type: Schema.Types.ObjectId, ref: 'User'}],  // thinking max array length of 5, 
 	// with highest bid at one end and lowest bid falls off the other end
 photo: String // or access item in _items { item.photo }
}, { timestamps: true });





module.exports = mongoose.model('Package', packageSchema);