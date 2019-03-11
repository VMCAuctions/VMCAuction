console.log('models/widget.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var widgetSchema = new Schema({
	name: {type: String},
	widgetImage: {type: String}
})

module.exports = mongoose.model('Widget', widgetSchema);
