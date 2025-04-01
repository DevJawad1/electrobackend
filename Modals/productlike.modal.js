const mongoo = require('mongoose')

let productlikeShccema=mongoo.Schema({
    user:String,
    product:String
})

let productlike= mongoo.model('Productlike', productlikeShccema)
module.exports= productlike