const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { verifyOtp } = require('../Controller/userController'); 
const upload = require('../middleware/Upload');
const auth = require('../middleware/auth');
const excelUpload = require('../middleware/ExcelUpload')
const uploadmiddleware = upload.single('profilePicture');

router.post('/register', uploadmiddleware, userController.register);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp); 
router.post('/login', userController.login);
router.post("/bulk-register",excelUpload.single('excelFile'), userController.bulkRegister);
// router.post("/bulk-register",excelUpload.single('excelFile'), userController.bulkRegister);
router.get('/profile', auth, userController.getProfile);
router.get('/all-users', userController.userList);
module.exports = router;
