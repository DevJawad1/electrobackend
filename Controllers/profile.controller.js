const setDatabase = require('../Modals/user.modal')
const productTable = require('../Modals/product.modal')
const userProfile=(req, res)=>{
    setDatabase.findOne({_id:req.body.id}).then((result)=>{
      if(result){
        // console.log(result.username);x
        res.send({message:"Details", result:result})
      }
    })
  }
  
  const userProduct= async(req, res)=>{
    try{
      const getproduct = await productTable.find({owner:req.body.id})
      if(getproduct){
        res.send({userproduct:getproduct})
      }
    }catch(err){
      console.log('Cannot get product ',err);
    }
  }
module.exports={userProduct, userProfile}