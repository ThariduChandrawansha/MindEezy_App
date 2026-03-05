const db = require('../config/db');
const nodemailer = require('nodemailer');

// Set up Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f8d9e65e4572fa",
    pass: "d939ec85d4c750"
  }
});

// Create an appointment
exports.createAppointment = async (req, res) => {
  const { userId, professionalId, appointmentDatetime, notes } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO appointments (user_id, professional_id, appointment_datetime, notes) VALUES (?, ?, ?, ?)',
      [userId, professionalId, appointmentDatetime, notes || '']
    );
    res.json({ id: result.insertId, message: 'Appointment requested successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'This time slot is already booked for this professional.' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Get appointments for a user (customer or professional)
exports.getAppointments = async (req, res) => {
  const { userId, role } = req.params;

  try {
    let query = '';
    
    if (role === 'customer') {
      // Customer sees the doctor info
      query = `
        SELECT a.*, u.username as professional_name, pd.specialty, pd.profile_pic_path
        FROM appointments a
        JOIN users u ON a.professional_id = u.id
        LEFT JOIN professional_details pd ON u.id = pd.user_id
        WHERE a.user_id = ?
        ORDER BY a.appointment_datetime ASC
      `;
    } else {
      // Doctor/Admin sees the patient info
      query = `
        SELECT a.*, u.username as patient_name, u.email as patient_email, 
               pd.profile_pic_path as patient_pic, pd.age, pd.gender
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        LEFT JOIN patient_details pd ON u.id = pd.user_id
        WHERE a.professional_id = ?
        ORDER BY a.appointment_datetime ASC
      `;
    }

    const [rows] = await db.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Appointment status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send Contact Email via Mailtrap
exports.sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'admin@mindeezy.com', // Receiver address
      subject: `New Contact Request: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
           <h2 style="color: #2563eb; margin-top: 0;">MindEezy Support Query</h2>
           <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
           <p><strong>Subject:</strong> ${subject}</p>
           <hr style="border-top: 1px dashed #ccc; margin: 20px 0;" />
           <p style="white-space: pre-wrap; color: #444;">${message}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

// Get all professionals with basic stats
exports.getProfessionals = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.username, pd.specialty, pd.profile_pic_path, pd.qualification, pd.experience_years, pd.bio,
             (SELECT COUNT(*) FROM appointments a WHERE a.professional_id = u.id AND a.status != 'cancelled') as total_channelings,
             (SELECT AVG(rating) FROM feedbacks f WHERE f.doctor_id = u.id) as avg_rating,
             (SELECT COUNT(*) FROM feedbacks f WHERE f.doctor_id = u.id) as review_count
      FROM users u 
      LEFT JOIN professional_details pd ON u.id = pd.user_id 
      WHERE u.role IN ('doctor', 'professional')
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single professional detail
exports.getProfessionalById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT u.id, u.username, pd.specialty, pd.profile_pic_path, pd.qualification, pd.experience_years, pd.bio, pd.license_number, pd.online_available,
             (SELECT COUNT(*) FROM appointments a WHERE a.professional_id = u.id AND a.status != 'cancelled') as total_channelings,
             (SELECT AVG(rating) FROM feedbacks f WHERE f.doctor_id = u.id) as avg_rating,
             (SELECT COUNT(*) FROM feedbacks f WHERE f.doctor_id = u.id) as review_count
      FROM users u 
      LEFT JOIN professional_details pd ON u.id = pd.user_id 
      WHERE u.id = ? AND u.role IN ('doctor', 'professional')
    `;
    const [rows] = await db.query(query, [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Professional not found' });
    
    // Get feedbacks
    const [feedbacks] = await db.query(`
      SELECT f.*, pu.username as patient_name 
      FROM feedbacks f 
      JOIN users pu ON f.patient_id = pu.id 
      WHERE f.doctor_id = ? 
      ORDER BY f.created_at DESC LIMIT 10
    `, [id]);
    
    res.json({ ...rows[0], recentFeedbacks: feedbacks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

