const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  getRecentBlogs,
  searchBlogs,
  getBlogsByTag
} = require('../controllers/blog/blogController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBlogs);
router.get('/recent', getRecentBlogs);
router.get('/search/:term', searchBlogs);
router.get('/tag/:tag', getBlogsByTag);
router.get('/user/:userId', getUserBlogs);
router.get('/:id', getBlog);

// Protected routes
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
