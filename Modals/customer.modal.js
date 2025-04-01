const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    customer:String,
    buyer:String,
})

const customerModal = mongoose.model('userCustomer', customerSchema)

module.exports = customerModal