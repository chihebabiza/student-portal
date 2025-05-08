const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', protect, logoutUser);

// View routes
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login - UniPortal',
        error: req.query.error // For showing errors from redirects
    })
});
router.get('/register', (req, res) => res.render('register'));
// router.get('/', (req, res) => res.render('index'));

// Protected dashboard routes
router.get('/admin/dashboard', protect, checkRole('admin'), (req, res) => {
    res.render('admin/admin', { user: req.user });
});

router.get('/user/dashboard', protect, checkRole('user'), (req, res) => {
    res.render('user/user', { user: req.user });
});

module.exports = router;