const mongoose =require('mongoose')

const productSchema = mongoose.Schema({
  name: {type:String, required:true},
  description: {type:String},
  price: {type:Number, required:true},
  condition: {type: String},
  discount: {type:Boolean},
  discountPrice: {type:Number},
  images: [String],
  categoryID: {
    type:mongoose.Schema.ObjectId,
    ref:"CategoryModel",
    required:true
  },
  brandID: {
    type:mongoose.Schema.ObjectId,
    ref:"BrandModel",
  },
  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SellerModel"
  }
},{
  timestamps:true,
  versionKey:false
})

const ProductModel = mongoose.model('products', productSchema)

module.exports = ProductModel;