const { default: mongoose } = require("mongoose");
const ProductModel = require("../models/productModel");
const SellerModel = require("../models/sellerModel");

const EmailSend = require('../utils/emailUtility');
const { EncodeToken } = require("../utils/tokenHelper");
const toObjectId = require('mongoose').Types.ObjectId

// complete
const userOTPService = async (email) => {
  try {
    let code = Math.floor(100000 + Math.random() * 900000);
    let emailText = `<h3>Please confirm your sign-up request</h3> </br></br>
    To verify your account is safe, please use the following code to enable your new device — it will expire in 30 minutes: </br> <h3>${code} </h3>`;
    let emailSubject = "Your confirmation code";
    await EmailSend(email, emailText, emailSubject);
    
    await SellerModel.updateOne(
      { email: email },
      { $set: { otp: code } }
    );
    return { status: "success", message: "6 digit OTP has been sent to your email" };
  } catch (err) {
    return { status: "failed", message: err.message };
  }
};
// complete
const verifyOTPService = async (email, otp) => {
  try{
    let  seller = await SellerModel.findOneAndUpdate({email:email , otp:otp}, {$set:{otp:"-1", isVerified:true}})
    if(!seller){
      return { status: "fail", message: "wrong otp"};
    }
    else{
      return { status: "success", message: "Valid otp"};
    }
  }
    catch (err) {
    return { status: "fail", message: err.message };
  }
};
// Complete
const SignUpService = async (sellerData) => {
  try{
    // check if the user is already available or not
    let isSeller = await SellerModel.findOne({email:sellerData.email})
    if(isSeller){
      return { status: "fail", message: "already have an account!" };
    }

    let seller = await SellerModel.create(sellerData)
    if(!seller){
      return {status:'fail', message:"Could not create account"}
    }

    // Create jwt token for authentication
    let token = EncodeToken(seller._id, seller.email)

    // Send OTP upon creating the account
    let response = await userOTPService(seller.email)
    response["token"] = token

    return response;
  }catch (err) {
    return { status: "failed", message: err.message };
  }
};

// Complete
const UpdateProfileService = async (sellerId, updateData) => {
  try{
    let id = new toObjectId(sellerId)
    await SellerModel.updateOne({_id :id}, {$set:updateData}, {upsert:true})
    return {status:'success' , message:"profile save success"}
  }catch (err) {
    return { status: "fail", message: err.message };
  }
};

const ReadProfileService = async (sellerId) => {
  try{
    if(!sellerId){
      return {status:"fail", message:"No credential is given"};
    }
    let id = new toObjectId(sellerId)

    let data = await SellerModel.aggregate([
      {$match:{_id:id}},
      {$project:{password:0, createdAt:0, updatedAt:0, otp:0}}
    ]);
    return {status:'success' ,data : data[0]}
  } 
  catch (err) {
    console.log(err)
    return { status: "fail", message: err.message };
  }
};

// Complete
const DeleteProfileService = async (sellerId) =>{
  try{
    if(!sellerId){
      return {status:"fail", message:"No credential is given"};
    }
    let id = new toObjectId(sellerId)

    let data = await SellerModel.deleteOne({_id:id});

    return {status:'success' ,message:"Profile deleted"}
  } 
  catch (err) {
    console.log(err)
    return { status: "fail", message: err.message };
  }

}

// Complete
const ReadProductsService = async (sellerId) => {
  try{
    if(!sellerId){
      return { status: "fail", message: "Unauthorized" };
    }
    let id = new toObjectId(sellerId)

    let data = await ProductModel.aggregate([
      {$match:{sellerID:id}},
      {$lookup:{from:"categories", localField:'categoryID', foreignField:'_id', as:"category", pipeline:[
        {$project:{_id:0, categoryName:1}}
      ]}},
      {$lookup:{from:"brands", localField:'brandID', foreignField:'_id', as:"brand", pipeline:[
        {$project:{_id:0, brandName:1}}
      ]}},
      {$unwind:"$category"},
      {$unwind:"$brand"},
    ]);

    if(!data){
      return {status:'fail' ,message : "No product found"}
    }
    return {status:'success' ,data : data}
  } 
  catch (err) {
    console.log(err)
    return { status: "fail", message: err.message };
  }
}
// complete -need better modification
const CreateProductService = async (productData)=>{
  try{

    if(!productData){
      return { status: "fail", message: "Invalid product information!" };
    }

    let product = await ProductModel.create(productData)
    if(!product){
      return {status:'fail', message:"Could not add product"}
    }

    return {status:"success", data: product};
  }catch (err) {
    return { status: "failed", message: err.message };
  }
}

const DeleteProductService = async (productId)=>{
  try{

    if(!productId){
      return { status: "fail", message: "Invalid product information!" };
    }

    let id = new mongoose.Types.ObjectId(productId)

    let product = await ProductModel.deleteOne({_id: id})
    if(!product){
      return {status:'fail', message:"Could not remove product"}
    }

    return {status:"success", data: product};
  }catch (err) {
    return { status: "fail", message: err.message };
  }
}

// (complete)
const ListByQueryService = async (sellerId, query) =>{
  try{
    let id = new mongoose.Types.ObjectId(sellerId)
    let searchRegex = {$regex:query, $options:"i"}
    let searchParams = [{title:searchRegex},{shortDes:searchRegex}]
    let searchQuery = {$or:searchParams}
    let matchStage = {$match:{$and:[{sellerID:id}, searchQuery]}}  //

    let joinWithBrandStage = {$lookup:{from:'brands', localField:"brandID", foreignField:"_id", as:"brand"}}
    let joinWithCategoryStage = {$lookup:{from:'categories', localField:"categoryID", foreignField:"_id", as:"category"}}
    let unwindBrandStage = {$unwind:"$brand"}
    let unwindCategoryStage = {$unwind:"$category"}
    let projectionStage = {$project:{'brand._id':0, 'category._id':0, 'categoryID':0, 'brandID':0,}}

    const data = await ProductModel.aggregate([
      matchStage,
      joinWithBrandStage,
      joinWithCategoryStage,
      unwindBrandStage,
      unwindCategoryStage,
      projectionStage
    ])

    if(!data){
      return {status:"failed"}
    }
    return {status:"success", data:data}
  }
  catch(err){
    console.log(err)
    return {status:"fail", message:err.message}
  }

}

module.exports = {
  userOTPService,
  verifyOTPService,
  SignUpService,
  UpdateProfileService,
  ReadProfileService,
  DeleteProfileService,
  ReadProductsService,
  CreateProductService,
  ListByQueryService,
  DeleteProductService
};