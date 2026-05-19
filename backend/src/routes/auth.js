// auth.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { protect } = require('../middleware/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', protect, AuthController.getMe);
router.put('/profile', protect, AuthController.updateProfile);
router.put('/change-password', protect, AuthController.changePassword);

module.exports = router;
