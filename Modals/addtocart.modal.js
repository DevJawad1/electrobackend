const mongo = require('mongoose')

let cartSchema = mongo.Schema({
    product:String,
    buyer:String,
    seller:String,
    deliver:Boolean,
    bought:Boolean,
    price:Number,
    quantity:Number 
})

let addcart = mongo.model('allCart', cartSchema)
module.exports= addcart