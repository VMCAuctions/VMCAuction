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
	tableOwner: { type: String },
	tableOwnerName: { type: String },
	// seats: { type: Number },
	userOrg: { type: String },
	wonPackages: {type: Boolean, default: false},
	totalPayment: {type: Number, default: 0},
	paidAmount: {type: Number, default: 0},
	fullyPaid: {type: Boolean, default: false},
	paymentInfo: { type: String }
	},
	{ timestamps: true, usePushEach: true }

);

module.exports = 	mongoose.model('User', userSchema);
