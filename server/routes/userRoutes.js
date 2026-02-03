const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getPublicProfile,
  deleteAccount
} = require('../controllers/user/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/:id/public', getPublicProfile);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteAccount);

module.exports = router;
