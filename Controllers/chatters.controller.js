const chatters = require('../Modals/chatters.modal');
const cart = require('../Modals/addtocart.modal');
const productTable = require('../Modals/product.modal');
const userDB = require('../Modals/user.modal');

// Create a new chat if it doesn't already exist
const chatter = async (req, res) => {
  try {
    const { chatter1, chatter2 } = req.body;

    const existingChat1 = await chatters.findOne({ chatter1, chatter2 });
    const existingChat2 = await chatters.findOne({ chatter1: chatter2, chatter2: chatter1 });

    if (existingChat1 || existingChat2) {
      return res.status(200).json({ save: true });
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
  
      const sellerIdSet = new Set();
  
      // 2. Add the other user in each chat to the seller set
      for (const chat of chats) {
        const otherUser = chat.chatter1 === user ? chat.chatter2 : chat.chatter1;
        if (otherUser && otherUser !== user) {
          sellerIdSet.add(otherUser);
        }
      }
  
      // 3. Get the user's cart
      const userCart = await cart.find({ buyer: user });
  
      if (userCart.length > 0) {
        for (const item of userCart) {
          const prd = await productTable.findById(item.product);
          if (!prd) continue;
  
          const sellerId = prd.owner;
  
          if (sellerId !== user && !sellerIdSet.has(sellerId)) {
           
            sellerIdSet.add(sellerId);
          }
        }
  
        res.status(200).json({
          status: true,
          sellers: [...sellerIdSet]
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


module.exports = { chatter, chatterList };
