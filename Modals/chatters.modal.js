const mongoose = require('mongoose')

const chatterSchema = mongoose.Schema({
  chatter1:String,
  chatter2:String,
  purpose:String,
})

const chatterModel = mongoose.model('chatersList', chatterSchema)

module.exports = chatterModel