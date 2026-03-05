const db = require('../config/db');

// --- Categories ---
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blog_categories ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description, cat_image_path } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO blog_categories (name, description, cat_image_path) VALUES (?, ?, ?)',
      [name, description, cat_image_path]
    );
    res.json({ id: result.insertId, message: 'Category created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, cat_image_path } = req.body;
  try {
    await db.query(
      'UPDATE blog_categories SET name=?, description=?, cat_image_path=? WHERE id=?',
      [name, description, cat_image_path, id]
    );
    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM blog_categories WHERE id=?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Blogs ---
exports.getBlogs = async (req, res) => {
  const { authorId } = req.query;
  try {
    let query = `
      SELECT b.*, c.name as category_name, u.username as author_name 
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category_id = c.id
      JOIN users u ON b.author_id = u.id
    `;
    let params = [];
    
    if (authorId) {
      query += ' WHERE b.author_id = ?';
      params.push(authorId);
    }
    
    query += ' ORDER BY b.publish_date DESC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT b.*, c.name as category_name, u.username as author_name 
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category_id = c.id
      JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBlog = async (req, res) => {
  const { category_id, author_id, title, content, image_path_1, image_path_2, image_path_3, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO blogs (category_id, author_id, title, content, image_path_1, image_path_2, image_path_3, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id || null, author_id, title, content, image_path_1, image_path_2, image_path_3, status || 'draft']
    );
    res.json({ id: result.insertId, message: 'Blog created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { category_id, title, content, image_path_1, image_path_2, image_path_3, status } = req.body;
  try {
    await db.query(
      'UPDATE blogs SET category_id=?, title=?, content=?, image_path_1=?, image_path_2=?, image_path_3=?, status=? WHERE id=?',
      [category_id || null, title, content, image_path_1, image_path_2, image_path_3, status, id]
    );
    res.json({ message: 'Blog updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM blogs WHERE id=?', [id]);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
