console.log('models/category.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var categorySchema = new Schema({
	name: {type: String, required: true, minlength: 4},
	
})



module.exports = 	mongoose.model('Category', categorySchema);