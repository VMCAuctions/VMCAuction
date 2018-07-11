// This uses the fast-csv module, but we'll probably end up using the csvtojson node module instead

var fs = require("fs")
var csv = require("fast-csv")

fs.createReadStream("Auction Item Packages-Table 1.csv")
  .pipe(csv())
  .on("data", function(data){
    console.log(data)
  })
  .on("end", function(end){
    console.log("Read is finished")
  })



// auctionFile = fs.createReadStream("Auction Item Packages-Table 1.csv")
//
// csv
//  .fromStream(auctionFile, {
//      headers: true,
//      ignoreEmpty: true
//  })
//  .on("data", function(data){
//    console.log("printing data")
//    console.log(data)
//      // data['_id'] = new mongoose.Types.ObjectId();
//      //
//      // authors.push(data);
//  })
//  .on("end", function(){
//    console.log("finished the read of the csv")
//      // Author.create(authors, function(err, documents) {
//      //    if (err) throw err;
//      // });
//      //
//      // res.send(authors.length + ' authors have been successfully uploaded.');
//  });
