console.log('models/category.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var categorySchema = new Schema({

	name: {type: String, required: true, minlength: 4},
	//_auctions: {type: Schema.Types.ObjectId, ref: 'Auction'}
})



module.exports = 	mongoose.model('Category', categorySchema);
