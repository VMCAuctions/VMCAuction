var Category = require('../models/category.js')
var categories = require('../controllers/categories.js')
var User = require('../models/user.js')
var users = require('../controllers/users.js')
var Global = require('../models/global.js')
var globals = require('../controllers/globals.js')

Category.find({}, function(err, result){
  if (err){
    console.log(err)
  }
  else if (result.length === 0){
    console.log("initialize.js 100 running categoriesinitialize")
    categories.initialize()
  }
  else{
    console.log("initialize.js 101 not running categoriesinitialize")
    // console.log("initialize.js 102. Categories result = ",result)
  }
})


User.find({}, function(err, result){
  if (err){
    console.log(err)
  }
  else if (result.length === 0){
    console.log("initialize.js 110 running usersinitialize")
    users.initialize()
  }
  else{
    console.log("initialize.js 111 not running usersinitialize")
    // console.log("initialize.js 112 Users result = ",result)
  }
})


Global.find({}, function(err, result){
  if (err){
    console.log(err)
  }
  else if (result.length === 0){
    console.log("initialize.js 120 running globalinitialize")
    globals.initialize()
  }
  else{
    console.log("initialize.js 121 not running globalinitialize")
    // console.log("initialize.js 122 Globals result._id = ",result._id)
  }
})
