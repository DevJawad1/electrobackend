const mongose = require('mongoose')


const productSchema = mongose.Schema({
    owner:String,
    productTit: String,
    image:[String],
    price: Number,
    quantity:Number,
    category:String,
    wishlist:Number,
    date:String,    
    discount:Number,
    cont:String,
    sales: Number,
    advert:String
})

let productTable = mongose.model('allProducts', productSchema)
module.exports = productTable