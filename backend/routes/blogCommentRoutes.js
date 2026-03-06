const express = require('express');
const router = express.Router();
const {
  getBlogComments,
  getBlogRating,
  createBlogComment,
  getAllComments,
  updateCommentStatus,
  deleteComment
} = require('../controllers/blogCommentController');

// Public - get approved comments & rating for a blog
router.get('/blog/:blogId', getBlogComments);
router.get('/blog/:blogId/rating', getBlogRating);

// Registered users - submit comment
router.post('/blog/:blogId', createBlogComment);

// Admin - get all comments for moderation
router.get('/admin/all', getAllComments);

// Admin - update status / delete
router.patch('/:id/status', updateCommentStatus);
router.delete('/:id', deleteComment);

module.exports = router;
