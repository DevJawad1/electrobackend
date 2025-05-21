const cartTable = require('../Modals/addtocart.modal')
const productTable = require('../Modals/product.modal')
let userTable = require('../Modals/user.modal')
let buyingTable = require('../Modals/brought.modal')
let historyTable = require('../Modals/history.modal')

const likeTable = require('../Modals/productlike.modal')
const addtocart = async (req, res) => {
  try {
    const productid = req.body.product;

    const count = await cartTable.countDocuments({ product: productid });
    console.log('Count:', count);

    const result = await productTable.findOne({ _id: productid });

    if (count >= result.quantity) {
      res.send({ message: "Not in stock", status: false });
    } else {
      const buyer = await cartTable.findOne({ buyer: req.body.buyer, product: productid });

      if (buyer) {
        console.log(buyer.quantity)
        // const deleteResult = await cartTable.deleteOne({ buyer: req.body.buyer, product: productid });
          if(buyer.quantity==result.quantity){
            res.send({ message: "You have added all the quantity in store", status: false });
          }
          buyer.quantity+=1
          await buyer.save()

            res.send({ quantity: buyer.quantity, status: false });
        // if (deleteResult.deletedCount > 0) {
        // }
      } else {
        const saveCart = new cartTable(req.body);
        const cartSaveResult = await saveCart.save();

        console.log('cartSave', cartSaveResult);
        res.send({ quantity: cartSaveResult.quantity, message: "Add to cart", status: true });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: "Internal Server Error", status: false });
  }
};


const getParticularCart=async(req, res)=>{
  
  try {
    const {buyer, product} = req.body
    const cart  = await cartTable.findOne({product, buyer})
    // console.log(buyer, product, cart)
    if(cart){
      res.send({quantity:cart.quantity, status:true})
    }else{
      res.send({quantity:0, status:true})
    }
    
  } catch (error) {
    console.log(error)
    res.send({msg:error.msg, status:false})
  }
}
const userCart = (req, res) => {
  console.log(req.body.buyer);
  const buyer = req.body.buyer;

  cartTable.find({ buyer: buyer })
    .then((result) => {
      if (result.length > 0) {
        const promises = result.map((item) => {
          return productTable.findById(item.product)
            .then((prodfound) => {
              if (prodfound) {
                return prodfound;
              }
            });
        });

        Promise.all(promises)
          .then((products) => {
            res.send({ status:true, message: "This is your cart products", cart: products, buyer: buyer });
          })
          .catch((err) => {
            console.log('Error occur finding cart ', err);
            res.status(500).send('Internal Server Error');
          });
      } else {
        console.log('Cart is empty');
        res.send({status:false, message: 'Your cart is empty', buyer: buyer });
      }
    })
    .catch((err) => {
      console.log('Error occur finding cart ', err);
      res.status(500).send('Internal Server Error');
    });
};

const deleteCart = (req, res) => {
  console.log(req.body);
  const {product, buyer} = req.body
  cartTable.findOne({ product, buyer })
    .then((result) => {
      console.log(result);
      if (!result) {
        res.status(404).send({ message: 'Quantity cannot be lesser than zero', status: false });
      } else {
        if(result.quantity>0){
          result.quantity-=1
          result.save()
          res.send({ quantity: result.quantity, status: true });
        }else{
          res.status(200).send({ message: 'Quantity cannot be lesser than zero', status: false });
        }
      }
    })
    .catch((err) => {
      console.error("Error deleting cart:", err);
      res.status(500).send({ message: 'Internal Server Error.', status: false });
    });
}

const realDelete = async (req, res) => {
  try {
    const { product, buyer } = req.body

    console.log(req.body)
    const deleteCart = await cartTable.findOneAndDelete({ product, buyer })

    if (deleteCart) {
      return res.status(200).send({
        status: true,
        msg: "Product deleted from cart"
      })
    } else {
      return res.status(404).send({
        status: false,
        msg: "This product is not in your cart anymore"
      })
    }

  } catch (error) {
    console.error("Error deleting cart item:", error)
    return res.status(500).send({
      status: false,
      msg: "Something went wrong while deleting the product"
    })
  }
}


const userWishList = (req, res) => {
  console.log(req.body.buyer);
  const buyer = req.body.buyer;

  likeTable.find({ user: buyer })
    .then((result) => {
      if (result.length > 0) {
        const promises = result.map((item) => {
          return productTable.findById(item.product)
            .then((prodfound) => {
              if (prodfound) {
                return prodfound;
              }
            });
        });

        Promise.all(promises)
          .then((products) => {
            res.send({ status:true, message: "This is your wishlist products", cart: products, buyer: buyer });
          })
          .catch((err) => {
            console.log('Error occur finding cart ', err);
            res.status(500).send('Internal Server Error');
          });
      } else {
        console.log('wishlist is empty');
        res.send({status:false, message: 'Your wishlist is empty', buyer: buyer });
      }
    })
    .catch((err) => {
      console.log('Error occur finding cart ', err);
      res.status(500).send('Internal Server Error');
    });
};
module.exports = { userCart, deleteCart, addtocart,getParticularCart, realDelete , userWishList}