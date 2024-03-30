
const {
  BrandByCategoryService,
  CategoryListService,
  DetailsService,
  ListByBrandService,
  ListByCategoryService,
  ListBySimilarService,
  ListByKeywordService } = require('../services/productServices')


// (complete)
exports.CategoryList = async (req, res) =>{
   try{
      const data = await CategoryListService()
      if(!data){
         return res.status(404).send({status:"fail", message:"No categories available"})
      }
      res.status(200).send({status:"success", message:"Category List", data:data})
   }
   catch(err) {
    console.log(err)
    res.status(404).send({message:err.message})
   }
}


// (complete)
exports.BrandByCategory = async (req, res) =>{
   try{
      const brands = await BrandByCategoryService(req.params.categoryId);
      if(!brands){
         return res.status(404).send({message:'No brands available'})
      }
      res.status(200).send({message:'Brands List', data:brands})
   }
   catch(err) {
    console.log(err)
    res.status(404).send({message:err.message})
   }
}

// (complete)
exports.Details = async (req, res) =>{
   try{
      const data = await DetailsService(req.params.productId)
      if(data.status !=="success"){
         return res.status(404).send(data)
      }
      res.status(200).send(data)
   }
   catch(err) {
    console.log(err)
    res.status(404).send({err})
   }
}

// (complete)  
exports.ListByBrand = async (req, res) =>{
   try{
      const data = await ListByBrandService(req.params.brandId)
      if(data.status !=="success"){
         return res.status(404).send(data)
      }
      res.status(200).send(data)
   }
   catch(err) {
      console.log(err)
      res.status(404).send({err})
   }
}

// (complete)
exports.ListByCategory = async (req, res) =>{
   try{
      const data = await ListByCategoryService(req.params.categoryId)
      if(data.status !=="success"){
         return res.status(404).send(data)
      }
      res.status(200).send(data)
   }
   catch(err) {
      console.log(err)
      res.status(404).send({err})
   }
}

// (Complete)
exports.ListBySimilar = async (req, res) =>{
   try{
      const data = await ListBySimilarService(req.params.categoryId)
      if(data.status !=="success"){
         return res.status(404).send(data)
      }
      res.status(200).send(data)
   }
   catch(err) {
      console.log(err)
      res.status(404).send({err})
   }
}
// (complete)
exports.ListByKeyword = async (req, res) =>{
   try{
      const data = await ListByKeywordService(req.params.keyword)
      if(data.status !== "success"){
         return res.status(404).send(data)
      }
      res.status(200).send(data)
   }
   catch(err) {
    console.log(err)
    res.status(404).send({err})
   }
}
