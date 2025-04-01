const express = require ('express')
const {
    backendSignup, 
    backendLogin, 
    verifyToken,
    // uploadproduct, 
    // like,
    // pimgsave,
    // saveOpt,
    // verifyEmail,
    // resetPassword,
    // getuserimg,
    // advert,
    // storenmUpd,
} = require ('../Controllers/user.controller')
// const {userCart, deleteCart, addtocart,} = require('../Controllers/cart.controller')
// const {sendcomment, writeComment, deletcom, reportComment} = require('../Controllers/comment.controller')
// const {sendNotification, deletnotification, readedNotification} = require('../Controllers/notification.controller')
const {userProduct, userProfile} = require('../Controllers/profile.controller')
// const {createFlw, WebHook, verifyUserpayment, userBalance}=require('../Controllers/fluttervirtualAccount.controller')
// const {
//     getProductsLike,
//     top5popularProduct, 
//     allPopularProduct, 
//     weeklyProducts, 
//     randomCategory, 
//     recentlyCategoryBought, 
//     userOneProduct,
//     popularPrdCategory,
//     getProductsCart,
//     lessViewProduct
// }= require('../Controllers/productalgorithm.controller')


// const {savingSearch, categorySearching, productSearching, searchSuggestion, storeSearching}= require('../Controllers/Searching.contoller')
// const {addcustomer, getAddedCustomer} = require('../Controllers/addCustomer.modal')

// const {oneProductPaymen, multiplePoductPayment}= require('../Controllers/productPurchase.controller')
const router = express.Router()
router.post('/register', backendSignup)
router.post('/login', backendLogin)
router.get('/token', verifyToken)
// router.post('/sendmail', saveOpt)
// router.post('/verifyEmail', verifyEmail)
// router.post('/resetpassword', resetPassword)
// router.post('/sendcomment', sendcomment)
// router.post('/writecomment', writeComment)
// router.post('/saveimg', pimgsave)
// router.post('/uploadproduct', uploadproduct)
// router.post('/like', like)
// router.post('/deletcom', deletcom)
// router.post('/addcustomer', addcustomer)
// router.post('/getCustomer', getAddedCustomer)
// router.post('/getuserimg', getuserimg)
// router.post('/addtocart', addtocart)
// router.post('/advert', advert)
// router.post('/storename', storenmUpd)
// router.post('/reportcom', reportComment),

// router.post('/sendnotification', sendNotification)
// router.post('/deletnotification', deletnotification)
// router.post('/readntf', readedNotification)


router.post('/userprofile', userProfile)
// router.post('/userproduct', userProduct)
// router.post('/userOneproduct', userOneProduct)
// router.post('/cart', userCart)
// router.post('/deletecart', deleteCart)

// router.post('/virtualaccount', createFlw)
// router.post('/webhook', WebHook)
// router.post('/balance', userBalance)
// router.post('/verifypayment', verifyUserpayment)

// router.post('/productpayment', oneProductPaymen)
// router.post('/multipleproductpayment', multiplePoductPayment)
// // defining product to user
// router.post('/getProductsLike', getProductsLike) 
// router.post('/getProductsCart', getProductsCart) 
// router.post('/top5popularProducts', top5popularProduct) 
// router.post('/popularPrdCategory', popularPrdCategory) 
// router.post('/allPopularProducts', allPopularProduct) 
// router.post('/weeklyProducts', weeklyProducts) 
// router.post('/randomCategory', randomCategory)
// router.post('/recommendOne', recentlyCategoryBought)
// router.post('/lessViewProduct', lessViewProduct)


// router.post('/searchsuggestion', searchSuggestion)
// router.post('/categorysearch', categorySearching)
// router.post('/productsearch', productSearching)
// router.post('/storesearch', storeSearching)
module.exports = router