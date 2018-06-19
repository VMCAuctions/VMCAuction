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
    console.log("running categoriesinitialize")
    categories.initialize()
  }
  else{
    console.log("not running categoriesinitialize")
  }
})


User.find({}, function(err, result){
  if (err){
    console.log(err)
  }
  else if (result.length === 0){
    console.log("running usersinitialize")
    users.initialize()
  }
  else{
    console.log("not running usersinitialize")
  }
})


Global.find({}, function(err, result){
  if (err){
    console.log(err)
  }
  else if (result.length === 0){
    console.log("running globalinitialize")
    globals.initialize()
  }
  else{
    console.log("not running globalinitialize")
  }
})
