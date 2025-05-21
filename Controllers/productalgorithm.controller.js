const productTable = require('../Modals/product.modal')
const history= require('../Modals/history.modal')
const cartTable = require('../Modals/addtocart.modal')
const alluser = require('../Modals/user.modal')
const allLike = require('../Modals/productlike.modal.js')

const getProductsLike = async (req, res) => {
    try {
        console.log("product like server")
        const { allproductId } = req.body;
        let allLikePrd = [];

        // Use Promise.all to handle the array of asynchronous operations
        const results = await Promise.all(allproductId.map(async (prdId) => {
            return await allLike.findOne({ product: prdId, user: req.body.user });
        }));

        // Filter out null results
        allLikePrd = results.filter(result => result !== null);

        // console.log(allLikePrd, "ddd")
        // Send the collected results back to the front end
        res.send(allLikePrd);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
}

const getProductsCart = async (req, res) => {
    try {
        const { allproductId } = req.body;
        let allLikePrd = [];

        // Use Promise.all to handle the array of asynchronous operations
        const results = await Promise.all(allproductId.map(async (prdId) => {
            return await cartTable.findOne({ product: prdId, buyer: req.body.user });
        }));

        // Filter out null results
        allLikePrd = results.filter(result => result !== null);

        // console.log(allLikePrd, "ddd")
        // Send the collected results back to the front end
        res.send(allLikePrd);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
}

const top5popularProduct=(req, res)=>{
    productTable.find().then(products=>{
        let popularProducts = products.filter(item=> item.hot>1000)
        // console.log(popularProducts);
        
        let sortpopularProduct=popularProducts.sort((a, b) => b.hot - a.hot);
        let top5PopularProducts = sortpopularProduct.slice(0, 5);
        res.send({popularTop5:top5PopularProducts, morePopularProduct:sortpopularProduct.length>5?true:false })
    })
}

const allPopularProduct=(req, res)=>{
    let popularProducts = products.filter(item=> item.hot>1000)
    let sortpopularProduct=popularProducts.sort((a, b) => b.hot - a.hot);
    res.send({popularTop:sortpopularProduct, })
}

const popularPrdCategory=async(req, res)=>{
    console.log('wow')
    let alloproduct= await productTable.find({})
    let actualProduct = await productTable.findOne({_id:req.body.product})
    let productCategory = await productTable.find({category:actualProduct.category})
    if(req.body.more){
        console.log(req.body.startingPoint);
        let remainingPrd=productCategory.filter((item , i)=> i>req.body.startingPoint)
        let newTen = remainingPrd.slice(0,10)
        res.send({product:newTen, more:remainingPrd.length>0?true:false})
    }else{
        console.log(actualProduct);
        console.log(productCategory);
        // sending ten item to fron end  untill user request for more
        let firstTen = productCategory.length>10?productCategory.slice(0,10):productCategory
        res.send({product:firstTen, more:productCategory.length<10?false:true})
    }
}
const categories = [
    { value: "" },
    { value: "Electronics" },
    { value: "Phone and Accessories" },
    { value: "Laptops and Computer" },
    { value: "Electrical Device" },
    { value: "Home Appliances" },
    { value: "Electrica Tools"},
    { value: "Kitchen and Dining" },
    { value: "Buliding tools" },
    { value: "Shoes and Canvas" },
    { value: "clothing and Outfit" },
    { value: "Shoes and Handbags" },
    { value: "Palm" },
    { value: "Bags" },
    { value: "School Kit" },
    { value: "Education resources" },
    { value: "Luxury Watches" },
    { value: "Watch" },
    { value: "Jewelry" },
    { value: "Luxury Jewelry" },
    { value: "Beauty and Skin Care" },
    { value: "Deoduorant and Perfume" },
    { value: "Healthcare product" },
    { value: "Babycare product" },
    { value: "Medical equipment" },
    { value: "Food and Ordering" },
    { value: "Pet" },
    { value: "Automotive and car" },
    { value: "Scientific Equipment" },
    { value: "Garden and Tools" },
    { value: "Toys and Teddy" },
    { value: "Video Games" },
    { value: "Furniture and Decor" },
    { value: "Office Furniture" },
    { value: "Office Products" },
    { value: "Home Furniture" },
    { value: "Books and Digital products" },
    { value: "Arts" },
    { value: "Musical Instruments" },
    { value: "Industrial and Scientific" },
    { value: "Art and Collectibles" },
    { value: "Luggage and suitcase" },
    { value: "Sports and Fitness" },
];

const checkWeeklyProduct=(date)=>{
    const specificDateString = date
            const specificDate = new Date(specificDateString);
            const currentDate = new Date();
            const differenceInMilliseconds = currentDate - specificDate;
            const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            return differenceInDays
            
}
const weeklyProducts = async (req, res) => {
    try {
        let date = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
        const getProduct = await productTable.find({});
        const weeklyProducts = [];

        getProduct.forEach((item, i) => {

            const specificDateString = item.date;
            const specificDate = new Date(specificDateString);
            const currentDate = new Date();
            const differenceInMilliseconds = currentDate - specificDate;
            const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            
            item.dayUsed = differenceInDays;
            // console.log(itemrf);
            if (item.dayUsed < 14) {
                weeklyProducts.push(item);
            }
        });

        // if(weeklyProducts.length<1){
        //     let lastSevenProducts = getProduct.slice(0,7)
        //     res.json(200){weeklyProducts:lastSevenProducts}
        //     return
        // }
        // res.send({ weeklyProducts:weeklyProducts });
        if (weeklyProducts.length < 1) {
            const lastSevenProducts = getProduct.slice(0, 7); 
            res.json({ weeklyProducts: lastSevenProducts });
            return;
        }
        res.json({ weeklyProducts: weeklyProducts });
        

    } catch (err) {
        console.error('Error retrieving products: ' + err);
        res.status(500).send('Internal Server Error');
    }
};
const randomCategory =async (req, res)=>{
    let random = Math.floor(Math.random() * categories.length-1) + 1
    // console.log(random, categories.length, categories[random]);
    let searchingValue = categories[random].value
    const getProduct = await productTable.find({category:searchingValue})
    // console.log(getProduct);

    let  sendFour = getProduct.slice(0,4)
    if(getProduct){
        res.send({title:categories[random].value, product:getProduct})
        
    }
}

const recentlyCategoryBought=(req, res)=>{
    history.find({buyer:req.body.user}).then((result)=>{
        console.log(result);
        // result.map()
    }).catch((err)=>{

    })
}

const userOneProduct =async (req,res) =>{
    try {
        console.log(req.body);
        const {productId, user} = req.body
        let findProduct = await productTable.findOne({_id:productId})
        let findProductCart = await cartTable.findOne({product:productId, buyer:user})
        let findProductLike = await allLike.findOne({user:user, product:productId})
        if(findProduct){
            let seller= await alluser.findOne({_id:findProduct.owner})
            let sellerStorename = seller.storename
            res.status(200).json({product:findProduct, status:true, productCart:findProductCart?true:false, sellerstoreName:sellerStorename, productLike:findProductLike?true:false})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({status:false, msg:"Error finding Product, Reload the page"})
    }
}


const lessViewProduct= async(req, res)=>{
    // updateProductImg()
    const {limit} = req.body
    console.log(limit)
    const allProduct = await productTable.find({})
    let sortpopularProduct=allProduct.sort((b, a) => b.hot - a.hot);
    const oldProduct = []
    allProduct.forEach((item, i) => {
        item.dayUsed = checkWeeklyProduct(item.date);
        // console.log(itemrf);
        if (item.dayUsed > 14 && item.hot<500) {
            oldProduct.push(item);
        }
    });
    // console.log(oldProduct.length);
    const length = oldProduct.slice(0,limit)
    res.status(200).json({product:length, more:oldProduct.length>limit?true:false , limit:length.length})
    // res.status(200).json
}


const updateProductImg=async()=>{
    productTable.find({}).then(products => {
        products.forEach(product => {
            if (product.userImg === "") {
                product.userImg = "https://res.cloudinary.com/dog1pqdax/image/upload/v1715874656/ozk0hgrnscf5m3cnocxb.jpg";
                product.save();  
            }
            
        });
    }).catch(err => {
        console.error("Error updating products:", err);
    });
    
}

const latestProduct = async (req, res) => {
    try {
      const last10 = await productTable.find({})
        .sort({ _id: -1 })
        .limit(10);
  
      if (last10 && last10.length > 0) {
        res.send({ success: true, message: "Products fetched", data: last10 });
      } else {
        res.send({ success: false, message: "No products found" });
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      res.send({ success: false, message: "Error fetching products" });
    }
};
  

const sortPrdByName=async(req, res)=>{
    // Example: All products
const allProducts = await productTable.find({})
  
  // Function to normalize names
  const normalizeName = (majorName) => {
    const lower = majorName.toLowerCase();
  
    if (lower.includes("tv")) return "tv";
    if (lower.includes("generator")) return "generator";
    if (lower.includes("speaker")) return "speaker";
    if (lower.includes("iron")) return "iron";
    if (lower.includes("macbook")) return "macbook";
    if (lower.includes("iphone")) return "iphone";
    if (lower.includes("hp")) return "hp laptop";
  
    return lower; // fallback to original name
  };
  
  // Step 1: Group by category
  const groupedByCategory = {};
  
  allProducts.forEach(product => {
    const cat = product.category;
    if (!groupedByCategory[cat]) groupedByCategory[cat] = [];
    groupedByCategory[cat].push(product);
  });
  
  // Step 2: Inside each category, group by normalized product name
  const finalOutput = {};
  
  for (const category in groupedByCategory) {
    const products = groupedByCategory[category];
    const nameGroup = {};
  
    products.forEach(prod => {
      const normName = normalizeName(prod.majorName);
      if (!nameGroup[normName]) {
        nameGroup[normName] = {
          name: normName,
          count: 1,
          items: [prod],
        };
      } else {
        nameGroup[normName].count += 1;
        nameGroup[normName].items.push(prod);
      }
    });
  
    finalOutput[category] = Object.values(nameGroup);
}

console.log(finalOutput);
res.send({ success: true, sortedCategory:finalOutput });
  
}


// const productLike = async (req, res) => {
//     try {
//         const { user, product, getter } = req.body;
//         const prd = await allLike.findOne({ user, product });

        
//         if (prd) {
//             if(!getter){
//                 await prd.deleteOne(); 
//                 return res.status(200).json({ msg: "Removed from Wishlist", like:false });
//             }
//         } else {
//             const saveLike = new allLike({ user, product });
//             await saveLike.save();
//             return res.status(200).json({ msg: "Added to Wishlist", like:true });
//         }
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// };

const productLike = async (req, res) => {
    try {
        const { user, product, getter } = req.body;
        const prd = await allLike.findOne({ user, product });

        if (prd) {
            if (!getter) {
                await prd.deleteOne();
                return res.status(200).json({ msg: "Removed from Wishlist", like: false });
            } else {
                // If getter is true and prd exists, just return like true
                return res.status(200).json({ msg: "Already in Wishlist", like: true });
            }
        } 
        
        // If no existing like found, save new like
        const saveLike = new allLike({ user, product });
        await saveLike.save();
        return res.status(200).json({ msg: "Added to Wishlist", like: true });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};


module.exports = { top5popularProduct, allPopularProduct, weeklyProducts, randomCategory, recentlyCategoryBought, userOneProduct, popularPrdCategory, getProductsLike, getProductsCart , lessViewProduct, latestProduct, sortPrdByName, productLike}