
const mongoose = require('mongoose')
const crypto = require('node:crypto')
const { DecodeToken } = require('../utils/tokenHelper')

const sellerSchema = new mongoose.Schema(
  {
    storeName: {type:String, required:true},
    email: {
      type:String,
      unique:true,
      required:true,
    },
    password:{
      type:String,
      required:true,
    },
    phone: {type:String},
    otp: {
      type:String,
    },
    address: {city:{type:String},street:{type:String}, zip:{type:String}},
    avatar:{type:String, default:'/default.png'},
    role:{type:String, default:'seller'},
    isVerified:{type:Boolean, default:false}

  },
  {timestamps:true, versionKey:false, toObject:{virtuals:true}, toJSON:{virtuals:true}}
)
sellerSchema.index({email:1}, {unique: true})

sellerSchema.methods.toJSON = ()=>{
  let seller = this;

  delete seller.password;
  delete seller.createdAt;
  delete seller.updatedAt;
  delete seller.otp;

  return seller;
}
sellerSchema.statics.Login = async (email, password) => {
  if(!email || !password){
    throw new Error("Email or Password can't be empty!")
  }
  let seller = await SellerModel.findOne({email:email})

  if(!seller ){
    throw new Error("No account available!")
  }
  let hashPass = await hashPassword(password)
  if(hashPass !==  seller.password){
    throw new Error("Password doesn't match!")
  }
  return seller;
}

sellerSchema.statics.verifyToken = async (token)=>{
  const decoded = DecodeToken(token)
  let seller = await SellerModel.findOne({_id:decoded._id})
  if(!seller){
    return null;
  }
  return seller;
}

const hashPassword = async (password)=>{
  return crypto.createHash('sha256').update(password).digest('hex')
}

sellerSchema.pre('save', async function (next){
  let seller = this
  if(seller.isModified('password') || seller.isNew){
		seller.password = await hashPassword(seller.password);
  }
  next()
})

const SellerModel = mongoose.model('sellers', sellerSchema)

module.exports = SellerModel;