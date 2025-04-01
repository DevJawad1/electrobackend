const mongoo = require('mongoose')

const notificationSchema = mongoo.Schema({
    sender:String,
    reciever:String,
    content:String,
    category:String,
    other:String,
    commentid:String,
    read:Boolean,
})

let ntfdb = mongoo.model('allNotification', notificationSchema) 
module.exports = ntfdb