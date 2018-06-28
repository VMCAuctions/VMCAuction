console.log('models/global.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var globalSchema = new Schema({
  pins: Array,
})

module.exports = mongoose.model('Global', globalSchema);

//Note: There will only be one of these global objects created, and these can be used to store information that can be accessed throughout the entire application
