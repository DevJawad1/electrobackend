const chatters = require('../Modals/chatters.modal');
const cart = require('../Modals/addtocart.modal');
const productTable = require('../Modals/product.modal');
const userDB = require('../Modals/user.modal');

// Create a new chat if it doesn't already exist
const chatter = async (req, res) => {
  try {
    const { chatter1, chatter2, purpose } = req.body;

    const existingChat1 = await chatters.findOne({ chatter1, chatter2 });
    const existingChat2 = await chatters.findOne({ chatter1: chatter2, chatter2: chatter1 });
    
    if (existingChat1) {
      if (existingChat1.purpose !== purpose) {
        existingChat1.purpose = purpose;
        await existingChat1.save(); 
        return res.status(200).json({ updated: true, status:true });
      } else {
        return res.status(200).json({ save: true, status:true });
      }
    } else if (existingChat2) {
      if (existingChat2.purpose !== purpose) {
        existingChat2.purpose = purpose;
        await existingChat2.save(); 
        return res.status(200).json({ updated: true, status:true });
      } else {
        return res.status(200).json({ save: true, status:true });
      }
    } else {
      // No existing chat found in either direction — maybe create a new one?
      const newChat = new chatters({ chatter1, chatter2, purpose });
      await newChat.save();
      return res.status(201).json({ created: true, status:true });
    }
    
    const newChat = new chatters(req.body);
    const savedChat = await newChat.save();

    if (savedChat) {
      console.log('Chat saved');
      res.status(200).json({ save: true });
    } else {
      console.log('Chat not saved');
      res.status(200).json({ save: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ save: false, message: 'Internal server error' });
  }
};

// Get full chat list for a user
const chatterList = async (req, res) => {
  try {
    const { user } = req.body;

    // 1. Get all existing chats involving the user
    const chats = await chatters.find({
      $or: [{ chatter1: user }, { chatter2: user }]
    });

    const sellerList = [];

    // 2. Add the other user and purpose to sellerList
    
    // 3. Get the user's cart
    const userCart = await cart.find({ buyer: user });
    
    if (userCart.length > 0) {
      for (const chat of chats) {
        const otherUser = chat.chatter1 === user ? chat.chatter2 : chat.chatter1;
        if (otherUser && otherUser !== user) {
          // Avoid duplicates
          if (!sellerList.some(item => item.sellerId === otherUser)) {
            sellerList.push({ sellerId: otherUser, purpose: chat.purpose });
          }
        }
      }
      
      res.status(200).json({
        status: true,
        sellers: sellerList
      });
    } else {
      res.status(200).json({
        status: false,
        message: "You can't chat with any seller for now. Start adding product to your cart"
      });
    }
  } catch (error) {
    console.error("Error in chatterList:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};


const getPurpose = async(req,res)=>{
  const {user,  purpose} = req.body

  try {
    if(purpose==""){
      res.status(200).json({
        status: true,
        message: null
      });
    }
      const prd = await productTable.findOne({_id:purpose})
      if(prd.owner==user){
        res.status(200).json({
          status: true,
          message: `Selling of ${prd.productTit} worth of ${prd.price} to this buyer`
        });
      }else{
        res.status(200).json({
          status: true,
          message: `Buying of ${prd.productTit} worth of ${prd.price} from this vendor`
        });
      }
    
  } catch (error) {
    console.log(error)
    res.status(200).json({
      status: false,
      message: `Error getting purpose`
    });
  }
  

}


module.exports = { chatter, chatterList, getPurpose };
