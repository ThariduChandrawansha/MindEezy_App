const db = require('../config/db');

// Get approved comments for a blog (anonymous display)
exports.getBlogComments = async (req, res) => {
  const { blogId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT id, rating, comment, status, created_at
       FROM blog_comments
       WHERE blog_id = ? AND status = 'approved'
       ORDER BY created_at DESC`,
      [blogId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get average rating for a blog
exports.getBlogRating = async (req, res) => {
  const { blogId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) as count, ROUND(AVG(rating), 1) as avg_rating
       FROM blog_comments
       WHERE blog_id = ? AND status = 'approved'`,
      [blogId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit a comment/rating (registered users only, displayed anonymously)
exports.createBlogComment = async (req, res) => {
  const { blogId } = req.params;
  const { user_id, rating, comment } = req.body;
  if (!user_id || !rating) return res.status(400).json({ message: 'user_id and rating are required' });
  try {
    // Check if user already commented on this blog
    const [existing] = await db.query(
      'SELECT id FROM blog_comments WHERE blog_id = ? AND user_id = ?',
      [blogId, user_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already submitted a review for this article.' });
    }
    await db.query(
      'INSERT INTO blog_comments (blog_id, user_id, rating, comment, status) VALUES (?, ?, ?, ?, ?)',
      [blogId, user_id, rating, comment || null, 'pending']
    );
    res.json({ message: 'Review submitted! It will appear after approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get ALL comments (all statuses) for moderation
exports.getAllComments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT bc.id, bc.blog_id, bc.rating, bc.comment, bc.status, bc.created_at,
              b.title as blog_title
       FROM blog_comments bc
       JOIN blogs b ON bc.blog_id = b.id
       ORDER BY bc.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Update comment status (approved / rejected / pending)
exports.updateCommentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    await db.query('UPDATE blog_comments SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Comment ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Delete a comment
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM blog_comments WHERE id = ?', [id]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
