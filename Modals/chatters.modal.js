const mongoose = require('mongoose')

const chatterSchema = mongoose.Schema({
  chatter1:String,
  chatter2:String,
})

const chatterModel = mongoose.model('chatters', chatterSchema)

module.exports = chatterModel