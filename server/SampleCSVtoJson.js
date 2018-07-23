// const csvFilePath="Auction Item Packages-Table 1.csv"
// const csv=require('csvtojson')
//
// csv()
// .fromFile(csvFilePath)
// .then((jsonObj)=>{
//     // console.log(jsonObj);
//     /**
//      * [
//      * 	{a:"1", b:"2", c:"3"},
//      * 	{a:"4", b:"5". c:"6"}
//      * ]
//      */
//
//      //Three cases:
//      /**
//      new package: item# is full and items is full
//      new item: items is empty but items is full
//      empty row: items is empty and items is empty
//      */
//
//
//
//      result = []
//      for (var i = 0; i < jsonObj.length; i++){
//        if (jsonObj[i]["Item #"] != ""){
//          jsonObj[i]["Items"] = [jsonObj[i]["Items"]]
//          jsonObj[i]["Donor"] = [jsonObj[i]["Donor"]]
//          jsonObj[i]["Value"] = [jsonObj[i]["Value"]]
//          result.push(jsonObj[i])
//        }
//        else{
//          if (jsonObj[i]["Items"] != ""){
//            // console.log("result[result.length - 1]['Items']", result[result.length - 1]["Items"])
//            result[result.length - 1]["Items"].push(jsonObj[i]["Items"])
//            result[result.length - 1]["Donor"].push(jsonObj[i]["Donor"])
//            result[result.length - 1]["Value"].push(jsonObj[i]["Value"])
//          }
//        }
//      }
//      console.log("result", result)
// })

const csvFilePath="2018 Gala Auction Item Tracker - 2018 Auction Item Tracker.csv"
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

     //Will eventually use wizard to match up csv columns with necessary fields; that is, the second value in these pairs will be req.body...
     columns = [
       ["itemNameColumn", "Item Name"],
       ["itemDescriptionColumn", "Item Description"],
       ["itemCategoryColumn", "Category"],
       ["itemValueColumn", "Value"],
       ["itemDonorColumn", "Donor"]
     ]

     //Might want to make a third field in above columns array that matches item property name exactly, or potentially urn the whole thing into a hash map instead

     //Make a validation checking that all of the fields match, then push all errors to an array and send that back if they don't

     //The CSV file needs to be in a standardized format to populate correctly; I can't tell the computer where to put each piece of information if there's no systematic ordering of that data (e.g., donor column should be broken into donor first, donor last, and organization, and not have just a few entries that have more than one donor); also, not sure what to do about restrictions and priority as they have no columns

     //When we actually get to the creation of auction items, will need to pipe in the auction id from req.params and include that with each item


     result = []
     for (var i = 0; i < jsonObj.length; i++){
       currentItem = {}
       for (var j = 0; j < columns.length; j++){
         currentItem[columns[j][0]] = jsonObj[i][columns[j][1]]
       }
       result.push(currentItem)
     }
     console.log("result", result)
})
