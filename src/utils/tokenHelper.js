const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.EncodeToken = (userId, email) => {
  if(!email || !userId){
    return null;
  }
  let payload = {email:email, _id:userId}
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES})
}

exports.DecodeToken = (token) => {
  try{
    if(!token){
      return null;
    }
    return jwt.verify(token, process.env.JWT_SECRET)
  }
  catch(err){
    console.log(err)
    return null;
  }
}
