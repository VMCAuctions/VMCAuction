var Category = require('../models/category.js')
var categories = require('../controllers/categories.js')
var User = require('../models/user.js')
var users = require('../controllers/users.js')

Category.find({}, function(err, result){
  if (err){
    console.log(err)
  }
  else if (result.length === 0){
    console.log("running categoriesinitialize")
    categories.initialize()
  }
  else{
    console.log("not running")
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
    console.log("not running")
  }
})
