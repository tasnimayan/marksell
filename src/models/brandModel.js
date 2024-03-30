const mongoose =require('mongoose')

const brandSchema = new mongoose.Schema({
  categoryID: {
    type:mongoose.Schema.ObjectId,
    ref:"CategoryModel",
    required:true
  },
  brandName:{
    type:String,
    unique:true,
    required:true
  }
},{
  timestamps:true,
  versionKey:false
})

const BrandModel = mongoose.model('brands', brandSchema)

module.exports = BrandModel;