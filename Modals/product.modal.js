const mongose = require('mongoose')


const productSchema = mongose.Schema({
    owner:String,
    productTit: String,
    image:Array,
    price: Number,
    quantity:Number,
    category:String,
    hot:Number,
    comments:Number,
    date:String,
    dayUsed:Number,
    discount:Number,
    cont:String,
    username:String,
    userImg:String,
    sales: Number,
    styling: Number,
    advert:String
})

let productTable = mongose.model('allProducts', productSchema)
module.exports = productTable