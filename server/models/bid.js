console.log('models/bid.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;



var bidSchema = new Schema({
 
 amount: {type: Number, required: true}, 
 _user: {type: Schema.Types.ObjectId, ref: 'User'},
 _package: {type: Number, ref: 'Package'}
   
 
 
}, { timestamps: true });





module.exports = mongoose.model('Bid', bidSchema);