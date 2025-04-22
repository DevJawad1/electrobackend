const mongose = require('mongoose')


const productSchema = mongose.Schema({
    owner:String,
    brand:String,
    productTit: String,
    majorName: String,
    image:[String],
    price: Number,
    quantity:Number,
    category:String,
    wishlist:Number,
    date:String,    
    discount:Number,
    cont:String,
    sales: Number,
    advert:String,
    address:String,
    rating:Number
})

let productTable = mongose.model('MenuTvItems', productSchema)
module.exports = productTable