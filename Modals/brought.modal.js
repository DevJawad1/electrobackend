let mongoose = require('mongoose')

let buyingSchema= mongoose.Schema({
    product: String,
    buyer: String,
    seller: String,
    address: String,
    city: String,
    quantity: Number,
    price:Number
})

let buyingTable = mongoose.model('allBuying', buyingSchema)

module.exports = buyingTable