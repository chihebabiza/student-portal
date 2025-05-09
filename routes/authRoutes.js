const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { loginUser, logoutUser, getLogin } = require('../controllers/authController');

// Public routes
router.post('/login', loginUser);
router.get('/logout', protect, logoutUser);
router.get('/login', getLogin);

module.exports = router;