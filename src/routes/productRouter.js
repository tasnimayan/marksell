const express = require('express')
const router = express.Router()


const { CategoryList, ListByCategory, Details, BrandByCategory, ListByBrand,  ListBySimilar, ListByKeyword} = require('../controllers/productController');

const { AuthVerification, AvailableFor } = require('../middlewares/AuthVerification');

// Full url to this route would be  
// {base_url/api/routing_points_here}


// router.get('/', AvailableFor(["seller", "admin"]), CreateProduct)
router.get('/product/:productId', Details)
router.get('/brands/:categoryId', BrandByCategory)
router.get('/brands/:brandId', ListByBrand)
router.get('/category', CategoryList)
router.get('/category/:categoryId', ListByCategory)
router.get('/similar/:categoryId', ListBySimilar)
router.get('/search/:keyword', ListByKeyword)

module.exports = router;
