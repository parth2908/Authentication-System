const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { verifyOtp } = require('../Controller/userController'); 
const upload = require('../middleware/Upload');
const auth = require('../middleware/auth');

const uploadmiddleware = upload.single('profilePicture');

router.post('/register', uploadmiddleware, userController.register);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp); 
router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);
router.get('/all-users', userController.userList);
// Update (Full Replace) - PUT
router.put('/update-user/:id',  userController.replaceUser);

// Partial Update - PATCH
router.patch('/update-profile/:id',  userController.updateUser);

// Delete User - DELETE
router.delete('/delete-user/:id', userController.deleteUser);

module.exports = router;
