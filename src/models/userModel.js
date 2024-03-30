
const mongoose = require('mongoose')
const crypto = require('node:crypto')
const { DecodeToken } = require('../utils/tokenHelper')

const userSchema = new mongoose.Schema(
  {
    fistName: {type:String, required:true},
    lastName: {type:String},
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
    photo: {type:String},
    address: {city:{type:String}, street:{type:String}},
    gender:{type: String},
    otp: {type:String},
    role:{type:String, default:'user'},
    isVerified:{type:Boolean, default:false}
  },
  {timestamps:true, versionKey:false, toObject:{virtuals:true}, toJSON:{virtuals:true}}
)
userSchema.index({email:1}, {unique: true})

userSchema.methods.toJSON = ()=>{
  let user = this;

  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.otp;

  return user;
}
userSchema.statics.Login = async (email, password) => {
  if(!email || !password){
    throw new Error("Email or Password can't be empty!")
  }
  let user = await UserModel.findOne({email:email})

  if(!user ){
    throw new Error("No account available!")
  }
  let hashPass = await hashPassword(password)
  if(hashPass !==  user.password){
    throw new Error("Password doesn't match!")
  }
  return user
}

userSchema.statics.verifyToken = async (token)=>{
  const decoded = DecodeToken(token)
  let user = await UserModel.findOne({_id:decoded._id})
  if(!user){
    return null;
  }
  return user;
}

const hashPassword = async (password)=>{
  return crypto.createHash('sha256').update(password).digest('hex')
}

userSchema.pre('save', async function (next){
  let user = this
  if(user.isModified('password') || user.isNew){
		user.password = await hashPassword(user.password);
  }
  next()
})

const UserModel = mongoose.model('users', userSchema)

module.exports = UserModel;