const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { adminAnnouncements, adminDashboard } = require('../controllers/adminController');

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
// router.get('/', (req, res) => res.render('index'));

// Protected dashboard routes
router.get('/admin/dashboard', protect, checkRole('admin'), adminDashboard);
router.get('/admin/announcements', protect, checkRole('admin'), adminAnnouncements);

router.get('/user/dashboard', protect, checkRole('user'), (req, res) => {
    res.render('user/user', { user: req.user });
});

module.exports = router;