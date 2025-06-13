const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const upload = require('../middleware/Upload');
const auth = require('../middleware/auth')
const uploadmiddleware = upload.single('profilePicture');
router.post('/register', uploadmiddleware ,userController.register);
router.post('/login', userController.login);
router.get('/profile',auth, userController.getProfile); 
router.get('/all-users', userController.userList); 
module.exports = router;
