const mongoose =  require('mongoose')

const comSchema= mongoose.Schema({
  comment:String,
  user:String,
  productid:String,
  userImg:String,
  username:String,
})

let commentContent = mongoose.model('allcomment', comSchema)
module.exports = commentContent