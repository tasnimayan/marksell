const express = require('express')
const router = express.Router()



const { UserSignUp, UserLogin, UserLogOut, VerifyOTP, UpdateProfile, ReadProfile, DeleteProfile, } = require('../controllers/userController')
const {AuthVerification} = require('../middlewares/AuthVerification')
const upload = require('../helpers/multer')

// Full url to this route would be  
// {base_url/api/v1/user/__endpoint__}


// User routing
router.post('/signup', UserSignUp)
router.get('/verify/:otp',AuthVerification, VerifyOTP)   // To verify user signup

router.post('/login', UserLogin)
router.get('/logout', AuthVerification, UserLogOut)

router.route('/profile')
.get(AuthVerification, ReadProfile)  // Get profile
.post(AuthVerification, upload.single('avatar'), UpdateProfile)  // Update profile
.delete(AuthVerification, DeleteProfile)  // Delete profile


module.exports = router;
