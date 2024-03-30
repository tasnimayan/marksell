
const UserModel = require("../models/userModel");
const {
  userOTPService,
  verifyOTPService,
  UpdateProfileService,
  ReadProfileService,
  SignUpService,
  DeleteProfileService
} = require("../services/userServices");
const { EncodeToken } = require("../utils/tokenHelper");

// Signup complete with OTP mailing
exports.UserSignUp = async (req, res) => {
  if(!req.body.email && !req.body.password){
    res.status(404).send({message:"email or password can not be empty"})
  }

  let user = {
    fistName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address
  }
  try{
    const result = await SignUpService(user);

    if(result.status !== 'success'){
      return res.status(404).send(result)
    }

    //cookie set
    let cookieOption = {
      expires: new Date(Date.now() + 24 * 6060 * 10000),
      httpOnly: false,
    };
    res.cookie("marksell", result.token, cookieOption);

    return res.status(200).send(result);
  }
  catch(err){
    res.status(500).send({message:err.message})
  }
};
// OTP verification complete
exports.VerifyOTP = async (req, res) =>{
  let result = await verifyOTPService(req.user?.email, req.params.otp)
  if(result.status !== 'success'){
    return res.status(404).send(result)
  }
  return res.status(200).send(result)
}
// Not needed
exports.UserOTP = async (req, res) => {
  const result = await userOTPService(req.user.email);
  return res.status(200).json(result);
};

// Login System complete
exports.UserLogin = async (req, res) => {
  let email = req.body.email ?? '';
  let password = req.body.password ?? '';
  try{
    const user = await UserModel.Login(email, password);

    if (!user) {
      return res.status(404).json({message:"No user found"});
    }
    // Create jwt token for authentication
    let token = await EncodeToken(user._id, user.email)
    //cookie set
    let cookieOption = {
      expires: new Date(Date.now() + 24 * 6060 * 10000),
      httpOnly: false,
    };
    res.cookie("marksell", token, cookieOption);
    res.status(200).send({status:"success",message:"User login successful", data:{_id:user._id, email:user.email,role:user.role}})
  }
  catch(err){
    res.status(500).send({message:err.message})
  } 
};
// Logout complete
exports.UserLogOut = async (req, res) => {
  let cookieOption = {
    expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
    httpOnly: false,
  };
  res.cookie("marksell", req.token, cookieOption);
  return res.status(200).send({status:"success", message:"Logged out"});
};

// Complete
exports.UpdateProfile = async (req, res) => {
  // None other than this fields will be updated
  let validUpdate = ["firstName", "lastName", "phone", "address", "gender"]
  const baseURL = req.headers.host
  let avatar;
  if(req.file){
    avatar = baseURL+req.file.path.replace(/\\/g,'/').slice(6);
  }
  let  data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    address: req.body.address,
    gender: req.body.gender,
  }
  avatar ? data["avatar"] = avatar : null
  const result = await UpdateProfileService(req.user._id, data);
  return res.status(200).json(result);
  
};
// Modification needed for validation
exports.ReadProfile = async (req, res) => {
  const result = await ReadProfileService(req.user?._id);
  res.status(200).send(result);
};

exports.DeleteProfile = async (req, res) =>{
  const result = await DeleteProfileService(req.user?._id)
  return res.status(200).send(result)
}

// exports.UserOrder = async (req, res) =>{
//   try{
//     const data = await ReadOrdersService(req.user._id)
//     if(data.status !=="success"){
//       return res.status(404).send(data)
//     }
//     res.status(200).send(data)
//   }
//   catch(err) {
//     console.log(err)
//     res.status(404).send({status:"fail", message:err.message})
//   }
// }