const mongoose = require ('mongoose')
const bcrypt= require('bcrypt')
  
let appSchema = mongoose.Schema({
    fullName: String,
    businessName: { type: String, unique: true, require: true }   ,
    email: {type:String, unique:true, require:true},
    phone: {type:String, require:true},
    address:String,
    city:String,
    postCode:String,
    country:String,
    region:String,
    emailverify:Boolean,
    balance:Number,
    password: {type:String, require:true},
    usertype: String,
    rate: Number,
    verified: Boolean,
    userImg:String,
    joined:String
})
let saltround=10
appSchema.pre('save', function(next){
  console.log(this.isNew);
  console.log(this.isModified("password"))
  if(this.isModified("password") || this.isNew){
    bcrypt.hash(this.password, saltround,(err, hash)=>{
      if(err){
        console.log('error occur when hashing', err);
      }
      else{
        this.password  = hash;
        console.log(this.password, ' password hash');
        next()
      }
    })
  }
})
  // if (this.isNew())

appSchema.methods.compareUser=async function(userPassword){
  try {
    const user = await bcrypt.compare(userPassword, this.password);
    return user;
  } catch (err) {
    console.error(err);
    return false;
  }
  }

let setDatabase = mongoose.model('alluser', appSchema) 
module.exports = setDatabase