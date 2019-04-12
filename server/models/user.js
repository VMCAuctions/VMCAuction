console.log('models/user.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var userSchema = new Schema(
	{
	userName: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: String, required: true },
	// email: {type: String, required: true},
	streetAddress: { type: String },
	city: { type: String },
	states: { type: String },
	zip: { type: String },
	password: { type: String },
	_auctions: { type: Schema.Types.ObjectId, ref: "Auction" },
	_packages: [{ type: Number, ref: "Package" }],
	admin: { type: Number },
	table: { type: String },
	tableOwner: { type: Boolean },
	tableOwnerName: { type: String },
	// seats: { type: Number },
	userOrg: { type: String }
	},
	{ timestamps: true, usePushEach: true }

);


// var userSchema = new Schema(
//   {
//     userName: { type: String, required: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     phone: { type: String, required: true },
//     // email: {type: String, required: true},
//     streetAddress: { type: String },
//     city: { type: String },
//     states: { type: String },
//     zip: { type: String },
// 	password: { type: String },
//     _auctions: { type: Schema.Types.ObjectId, ref: "Auction" },
//     _packages: [{ type: Number, ref: "Package" }],
// 	admin: { type: Number },
// 	table: { type: String, default: "0" },
// 	tableOwner: { type: String },
// 	userOrg: { type: String }
//   },
//   { usePushEach: true }
// );



module.exports = 	mongoose.model('User', userSchema);
