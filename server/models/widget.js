console.log('models/widget.js');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var widgetSchema = new Schema({
	name: {type: String},
	widgetImage: {type: String}
})

module.exports = mongoose.model('Widget', widgetSchema);


// this.usersCsv = function(req, res){
// 		//May need to add validation checks so that only admins can see
// 		console.log("400 users.js this.usersCsv start")
// 		console.log("401 users.js this.usersCsv.  req.body = ", req.body)
// 		console.log("401 users.js this.usersCsv.  req.body.filename = ", req.body.filename)
// 		console.log("401 users.js this.usersCsv.  req.session = ", req.session)
// 		console.log("401 users.js this.usersCsv.  req.params = ", req.params)
		
// 		const csvFilePath=("C:/AA_local_Code/MEAN/aa_vmc/VMCAuction/public/" + req.body.csvUpload);
		
// 		console.log("402 users.js this.usersCsv.  csvFilePath = ",csvFilePath)

// 		csv()
// 		.fromFile(csvFilePath)
// 		.then((jsonObj)=>{
			
// 			console.log("403 users.js this.usersCsv.  jsonObj[0][User Name] = ", jsonObj[0]["User Name"])
// 			console.log("404 users.js this.usersCsv.  jsonObj[0] = ", jsonObj[0])
// 			// console.log("405 users.js this.usersCsv.  jsonObj = ", jsonObj)
// 			console.log("405.1 users.js this.usersCsv.  jsonObj.length = ", jsonObj.length)

// 			for (var i = 0; i < jsonObj.length; i++){

// 				if (jsonObj[i]){

// 					console.log("405.5 users.js this.usersCsv pre User.create.  user in jsonObj[i] = ",jsonObj[i])

// 					User.create({
// 						userName: jsonObj[i]["User Name"],
// 						firstName: jsonObj[i]["First Name"],
// 						lastName: jsonObj[i]["Last name"],
// 						phone: jsonObj[i]["Phone"],
// 						streetAddress: jsonObj[i]["Street"],
// 						city: jsonObj[i]["City"],
// 						states: jsonObj[i]["State"],
// 						zip: jsonObj[i]["Zip"],
// 						admin: jsonObj[i]["Admin"],
						
						
// 					}, function(err, user){
// 						if(err){
// 							console.log("406 users.js this.usersCsv User.create fail.  err = ",err)
							
// 						}else{
// 							console.log("407 users.js this.usersCsv User.create success.  ")
// 						}
// 					});
// 				}
// 			}
			
// 		}).then(res.redirect('/' + req.params.auctions + '/users'));
		
		
	