const db = require('../config/db');

exports.submitFeedback = async (req, res) => {
  const { appointment_id, patient_id, doctor_id, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    await db.query(
      `INSERT INTO feedbacks (appointment_id, patient_id, doctor_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
      [appointment_id, patient_id, doctor_id, rating, comment || '']
    );
    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorFeedbacks = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT f.*, u.username as patient_name, a.appointment_datetime
      FROM feedbacks f
      JOIN users u ON f.patient_id = u.id
      JOIN appointments a ON f.appointment_id = a.id
      WHERE f.doctor_id = ?
      ORDER BY f.created_at DESC
    `, [doctorId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkFeedback = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM feedbacks WHERE appointment_id = ?', [appointmentId]);
    res.json(rows.length > 0 ? rows[0] : null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
