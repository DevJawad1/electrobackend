const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const otpSchema = mongoose.Schema({
    user: String,
    type: String,
    otpcode: {type:String, require:true},
})
const saltround=10
otpSchema.pre('save', function(next){
  console.log("New is ", this.isNew);
  // this.isModified("password") || this.isNew
  if(this.isModified("otpcode") || this.isNew){
    bcrypt.hash(this.otpcode, saltround ,(err, hash)=>{
      if(err){
        console.log('error occur when hashing', err);
      }
      else{
        this.otpcode  = hash;
        console.log(this.otpcode, 'otp hash');
        return next()
      }
    })
  }
})

otpSchema.methods.compareOtp=async function(userCode){
  try {
    const user = await bcrypt.compare(userCode, this.otpcode);
    return user;
  } catch (err) {
    console.error(err);
    return false;
  }
}
const otpModel = mongoose.model("userOtp", otpSchema)
module.exports = otpModel