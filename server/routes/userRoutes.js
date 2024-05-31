// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const  protect  = require('../Middlewares/authMiddleware');

router.post('/register', userController.register);

router.post('/login', userController.login );

router.post('/setAvatar/:id', userController.uploadAvatar, protect, userController.setAvatar);

router.get('/me', protect, userController.authMe);
router.post('/logout', userController.logout ) ;

// router.get('/allusers', protect, userController.getAllUsers);

module.exports = router;