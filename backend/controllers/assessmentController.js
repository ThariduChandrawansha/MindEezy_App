const db = require('../config/db');

exports.createAssessment = async (req, res) => {
  const { professional_id, name, description, questions } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO assessments (professional_id, name, description, questions) VALUES (?, ?, ?, ?)',
      [professional_id, name, description, JSON.stringify(questions)]
    );
    res.status(201).json({ id: result.insertId, message: 'Assessment created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorAssessments = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM assessments WHERE professional_id = ? ORDER BY created_at DESC', [doctorId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAssessments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, u.username as professional_name 
      FROM assessments a 
      JOIN users u ON a.professional_id = u.id 
      ORDER BY a.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM assessments WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitResponse = async (req, res) => {
  const { id } = req.params;
  const { user_id, responses, score, notes } = req.body;
  
  try {
    await db.query(
      'INSERT INTO assessment_responses (assessment_id, user_id, responses, score, notes) VALUES (?, ?, ?, ?, ?)',
      [id, user_id, JSON.stringify(responses), score || 0, notes || '']
    );
    res.json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorResponses = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT ar.*, a.name as assessment_name, u.username as patient_name, u.email as patient_email 
      FROM assessment_responses ar
      JOIN assessments a ON ar.assessment_id = a.id
      JOIN users u ON ar.user_id = u.id
      WHERE a.professional_id = ?
      ORDER BY ar.response_date DESC
    `, [doctorId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerResponses = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT ar.*, a.name as assessment_name 
      FROM assessment_responses ar
      JOIN assessments a ON ar.assessment_id = a.id
      WHERE ar.user_id = ?
      ORDER BY ar.response_date DESC
    `, [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
