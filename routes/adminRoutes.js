const express = require('express');
const { adminDashboard, adminAnnouncements, adminProjects, adminStudents } = require('../controllers/adminController');
const { protect, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/dashboard', protect, checkRole('admin'), adminDashboard);
router.get('/announcements', protect, checkRole('admin'), adminAnnouncements);
router.get('/projects', protect, checkRole('admin'), adminProjects);
router.get('/students', protect, checkRole('admin'), adminStudents);

module.exports = router;