const express = require('express')
const router = express.Router()



const { SellerSignUp, SellerLogin, SellerLogOut, SellerProducts, ReadProfile, UpdateProfile, DeleteProfile, VerifyOTP, CreateProduct, SearchProduct, DeleteProduct } = require('../controllers/sellerController')
const { AvailableFor, SellerAuthVerification} = require('../middlewares/AuthVerification')
const upload = require('../helpers/multer')

// Full url to this route would be  
// {base_url/api/v1/seller/__endpoint__}


router.post('/signup', SellerSignUp)
router.get('/verify/:otp',SellerAuthVerification, VerifyOTP)   // To verify user signup

router.post('/login', SellerLogin)
router.get('/logout', SellerAuthVerification, SellerLogOut)

router.route('/profile')
  .get(SellerAuthVerification, AvailableFor(["seller"]), ReadProfile)  // Get profile
  .post(SellerAuthVerification, AvailableFor(["seller"]), upload.single('avatar'), UpdateProfile)  // Update profile
  .delete(SellerAuthVerification, AvailableFor(["seller"]), DeleteProfile)  // Delete profile


router.route('/products')
  .get(SellerAuthVerification, AvailableFor(["seller"]), SellerProducts )
  .post(SellerAuthVerification, AvailableFor(["seller"]), CreateProduct )

router.route('/products/:productId')
  .delete(SellerAuthVerification, AvailableFor(["seller"]), DeleteProduct )

router.get('/search/:keyword',SellerAuthVerification, SearchProduct)

module.exports = router;
