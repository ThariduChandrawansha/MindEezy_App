const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  sendContactEmail,
  getProfessionals,
  getProfessionalById
} = require('../controllers/publicController');

// Appointments routes
router.post('/appointments', createAppointment);
router.get('/appointments/:userId/:role', getAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Contact email route
router.post('/contact', sendContactEmail);

// Professionals directory
router.get('/professionals', getProfessionals);
router.get('/professionals/:id', getProfessionalById);

// Fetch doctors list for appointment dropdown
const db = require('../config/db');
router.get('/doctors', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.username, pd.specialty 
      FROM users u 
      JOIN professional_details pd ON u.id = pd.user_id 
      WHERE u.role IN ('doctor', 'professional')
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
