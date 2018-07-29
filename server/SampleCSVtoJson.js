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

require('./config/mongoose.js');
var Item = require('./models/item.js')

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

     //Will eventually use wizard to match up csv columns with necessary fields; that is, the second value in these pairs will be req.body, and the third is the field in the DB...
     columns = [
       ["itemNameColumn", "Item Name", "name", null],
       ["itemDescriptionColumn", "Item Description", "description", null],
       ["itemCategoryColumn", "Category", "_category", null],
       ["itemValueColumn", "Value", "value", "number"],
     ]
     //["itemDonorColumn", "Donor"]



     //Make a validation checking that all of the fields match, then push all errors to an array and send that back if they don't

     //The CSV file needs to be in a standardized format to populate correctly; I can't tell the computer where to put each piece of information if there's no systematic ordering of that data (e.g., donor column should be broken into donor first, donor last, and organization, and not have just a few entries that have more than one donor); also, not sure what to do about restrictions and priority as they have no columns

     //When we actually get to the creation of auction items, will need to pipe in the auction id from req.params and include that with each item



     //First, check if all of the columns the user specified are in the first json object of the json object array (just have to check the first because they should all be the same).  If they aren't, do not populate any items and print an error message instead.
     errorString = ""
     for (index in columns){
       if (!jsonObj[0].hasOwnProperty(columns[index][1])){
         errorString += ("\n" + columns[index][1] + " is not a valid column in CSV.")
       }
     }
     if (errorString.length > 0){
       console.log(errorString)
     }
     else{
       result = []
       errorList = ""
       // for (var i = 0; i < jsonObj.length; i++){
       // NOTE: Commented the above out because some CSV rows don't have values, which is stopping generation of all items
       for (var i = 0; i < jsonObj.length; i++){
         validItem = true
         currentItem = {}
         //Note: Columns are all mandatory, but may want to have another data structure to handle optional data and still have the document be created when those fields are blank
         for (var j = 0; j < columns.length; j++){
           toAdd = jsonObj[i][columns[j][1]]
           if (toAdd == ""){
             validItem = false
             break
           }
           //Changing string of value to number
           if (columns[j][3] == "number"){
             convertedNumber = parseInt(toAdd)
             if (isNaN(convertedNumber)){
               validItem = false
               break
             }
             currentItem[columns[j][2]] = convertedNumber
           }
           else{
             currentItem[columns[j][2]] = toAdd
           }
         }
         if (validItem === true){
           //Adding in auction id manually, for testing
           currentItem["_auctions"] = "5b5690e7ccd903c0107588d8"
           // console.log("currentItem", currentItem)
           Item.create(currentItem,  function(err, result){
             if(err){
               console.log(err);
             }else{
               // console.log("current item made", currentItem)
             }
           });
         }
         else{
           errorList += "row " + (i + 2) + "\n"
         }
         // console.log(currentItem)
       }
       if (errorList.length > 0){
         console.log("The following rows failed validation:\n" + errorList)
       }
     }
     //   result.push(currentItem)
     // }
     // console.log("result", result)
})
