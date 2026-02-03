const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProject,
  getUserProjects,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  searchProjects
} = require('../controllers/project/projectController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/search/:term', searchProjects);
router.get('/user/:userId', getUserProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
module.exports = router;
