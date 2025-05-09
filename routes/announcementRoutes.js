const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsPage
} = require('../controllers/announcementController');

// Public routes
router.get('/', getAnnouncementsPage);

// Protected admin routes
router.post('/admin/announcements', protect, checkRole('admin'), createAnnouncement);
router.post('/admin/announcements/:id', protect, checkRole('admin'), updateAnnouncement);
router.get('/admin/announcements/delete/:id', protect, checkRole('admin'), deleteAnnouncement);
//  /admin/announcements/681d4114eeaf0605c1675916
module.exports = router;