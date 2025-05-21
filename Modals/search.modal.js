const mongoose = require('mongoose')

const searchSchema = mongoose.Schema({
    type:String,
    value:String,
    user:String,
    length:Number,
})

const searchModal = mongoose.model('allSearch', searchSchema)

module.exports = searchModal