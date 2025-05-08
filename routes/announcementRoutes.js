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
router.post('/create', protect, checkRole('admin'), createAnnouncement);
router.put('/:id', protect, checkRole('admin'), updateAnnouncement);
router.delete('/:id', protect, checkRole('admin'), deleteAnnouncement);

module.exports = router;