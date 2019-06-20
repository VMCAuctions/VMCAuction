console.log('models/item.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;


var itemSchema = new Schema({
 name: {type: String, required: true, minlength: 4},
 description: {type: String, required: true, minlength: 4},
 _category: {type: String},
 donorPrefix: {type: String},
 donorFirst: {type: String},
 donorLast: {type: String},
 donorOrg: {type: String},
 donorDisplay: {type: String},
 restrictions: {type: String},
 value: {type: Number, required: true},
 packaged: {type: Boolean, default:false},
 priority: {type: Number, required: true, default: 0},
 _auctions: {type: Schema.Types.ObjectId, required:true, ref: 'Auction'},
 photo: {type: String},
 _package: {type: Number, ref: 'Package'}
}, { timestamps: true, usePushEach: true });





itemSchema.plugin(autoIncrement.plugin, {model: 'Item', startAt: 1000});
module.exports = mongoose.model('Item', itemSchema);

// mongoose.model('Item', itemSchema);

// var Item = mongoose.model('Item');
