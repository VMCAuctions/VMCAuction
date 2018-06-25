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
