const csvFilePath="Auction Item Packages-Table 1.csv"
const csv=require('csvtojson')

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    // console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */

     //Three cases:
     /**
     new package: item# is full and items is full
     new item: items is empty but items is full
     empty row: items is empty and items is empty

     */
     result = []
     for (var i = 0; i < jsonObj.length; i++){
       if (jsonObj[i]["Item #"] != ""){
         jsonObj[i]["Items"] = [jsonObj[i]["Items"]]
         jsonObj[i]["Donor"] = [jsonObj[i]["Donor"]]
         jsonObj[i]["Value"] = [jsonObj[i]["Value"]]
         result.push(jsonObj[i])
       }
       else{
         if (jsonObj[i]["Items"] != ""){
           // console.log("result[result.length - 1]['Items']", result[result.length - 1]["Items"])
           result[result.length - 1]["Items"].push(jsonObj[i]["Items"])
           result[result.length - 1]["Donor"].push(jsonObj[i]["Donor"])
           result[result.length - 1]["Value"].push(jsonObj[i]["Value"])
         }
       }
     }
     console.log("result", result)
})
