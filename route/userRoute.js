const express = require('express');
const userService = require('../service/userService');
const router = express.Router();
router.post('/register', userService.createUser);
router.post('/login', userService.login);
router.post('/verify-otp', userService.verifyOtp);
module.exports = router;
