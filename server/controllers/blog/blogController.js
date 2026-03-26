const Blog = require('../../models/Blog');

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, cover_image, tags, published } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content'
      });
    }

    const blogData = {
      user_id: req.user.id,
      title,
      content,
      excerpt,
      cover_image,
      tags: tags || [],
      published: published !== undefined ? published : true
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogs = async (req, res) => {
  try {
    const { user_id, published, limit } = req.query;
    
    const filters = {};
    if (user_id) filters.user_id = user_id;
    if (published !== undefined) filters.published = published === 'true';
    if (limit) filters.limit = parseInt(limit);

    const blogs = await Blog.findAll(filters);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    await Blog.incrementViews(req.params.id);

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/user/:userId
// @access  Public
exports.getUserBlogs = async (req, res) => {
  try {
    // Check if requesting user is the owner (to include unpublished)
    const includeUnpublished = req.user && req.user.id === req.params.userId;
    
    const blogs = await Blog.findByUserId(req.params.userId, includeUnpublished);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user blogs',
      error: error.message
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res) => {
  try {
    const allowedUpdates = ['title', 'content', 'excerpt', 'cover_image', 'tags', 'published'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const blog = await Blog.update(req.params.id, req.user.id, updates);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found or you do not have permission to update it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found or you do not have permission to delete it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
};

// @desc    Get recent blogs
// @route   GET /api/blogs/recent
// @access  Public
exports.getRecentBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const blogs = await Blog.getRecent(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Get recent blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent blogs',
      error: error.message
    });
  }
};

// @desc    Search blogs
// @route   GET /api/blogs/search/:term
// @access  Public
exports.searchBlogs = async (req, res) => {
  try {
    const blogs = await Blog.search(req.params.term);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching blogs',
      error: error.message
    });
  }
};

// @desc    Get blogs by tag
// @route   GET /api/blogs/tag/:tag
// @access  Public
exports.getBlogsByTag = async (req, res) => {
  try {
    const blogs = await Blog.findByTag(req.params.tag);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Get blogs by tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs by tag',
      error: error.message
    });
  }
};
