let mongoose = require('mongoose')

let historySchema= mongoose.Schema({
    product: String,
    buyer: String,
    seller: String,
    address: String,
    city: String,
    quantity: Number,
    price: Number
})

let historyTable = mongoose.model('allHistory', historySchema)

module.exports = historyTable