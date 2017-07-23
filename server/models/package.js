console.log('models/package.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;



var packageSchema = new Schema({
 name: {type: String, required: true, minlength: 4},
 _items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
 description: {type: String, maxlength: 250},
 //donor: {type: String, default: 'anonymous'}, // can access donor(s) by looping for item in package._items { item.donor }
 _category: String,
//  _category: {type: Schema.Types.ObjectId, ref: 'Category'},
 value: Number,  // maybe prepopulate field with for item in package._items { value += item.value }
 

 bid_increment: Number,  // increment is a reserved word, so used bid_increment
 _bids: [{type: Schema.Types.ObjectId, ref: 'Bid'}],  ///////// maybe have highest bid at one end 
 /////////// and have lowest bids removed from the other end //////////////////////////////////////////////////////

 photo: String // or access item in _items { item.photo }
}, { timestamps: true });




packageSchema.plugin(autoIncrement.plugin, {model: 'Package', field: 'packageId', startAt: 100});

module.exports = mongoose.model('Package', packageSchema);