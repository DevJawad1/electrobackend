const mongo = require('mongoose')

let cartSchema = mongo.Schema({
    product:String,
    buyer:String,
    quantity:Number 
})

let addcart = mongo.model('allCart', cartSchema)
module.exports= addcart