const db = require('../config/db');

exports.getPatientProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM patient_details WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(200).json(null); // Explicitly return null if no profile exists
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePatientProfile = async (req, res) => {
  const { userId } = req.params;
  const { age, gender, address, phone, medical_history, stress_triggers, profile_pic_path } = req.body;

  try {
    // Check if profile exists
    const [existing] = await db.query('SELECT id FROM patient_details WHERE user_id = ?', [userId]);
    
    if (existing.length > 0) {
      // Update
      await db.query(
        `UPDATE patient_details SET 
          age = ?, gender = ?, address = ?, phone = ?, 
          medical_history = ?, stress_triggers = ?, profile_pic_path = ?
        WHERE user_id = ?`,
        [age || null, gender || null, address || null, phone || null, medical_history || null, stress_triggers || null, profile_pic_path || null, userId]
      );
    } else {
      // Insert
      await db.query(
        `INSERT INTO patient_details (user_id, age, gender, address, phone, medical_history, stress_triggers, profile_pic_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, age || null, gender || null, address || null, phone || null, medical_history || null, stress_triggers || null, profile_pic_path || null]
      );
    }
    
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imagePath = `/uploads/profiles/${req.file.filename}`;

  try {
    // Upsert into patient_details
    const [existing] = await db.query('SELECT id FROM patient_details WHERE user_id = ?', [userId]);

    if (existing.length > 0) {
      // Update
      await db.query('UPDATE patient_details SET profile_pic_path = ? WHERE user_id = ?', [imagePath, userId]);
    } else {
      // Insert
      await db.query('INSERT INTO patient_details (user_id, profile_pic_path) VALUES (?, ?)', [userId, imagePath]);
    }

    res.json({ message: 'Profile picture uploaded successfully', profile_pic_path: imagePath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PROFESSIONAL (DOCTOR) PROFILE CONTROLLERS
exports.getProfessionalProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM professional_details WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(200).json(null);
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfessionalProfile = async (req, res) => {
  const { userId } = req.params;
  const { qualification, specialty, category, experience_years, license_number, bio, availability } = req.body;

  try {
    const [existing] = await db.query('SELECT id FROM professional_details WHERE user_id = ?', [userId]);
    
    if (existing.length > 0) {
      await db.query(
        `UPDATE professional_details SET 
          qualification = ?, specialty = ?, category = ?, experience_years = ?, 
          license_number = ?, bio = ?, availability = ?
        WHERE user_id = ?`,
        [qualification || null, specialty || null, category || null, experience_years || null, license_number || null, bio || null, availability ? JSON.stringify(availability) : null, userId]
      );
    } else {
      await db.query(
        `INSERT INTO professional_details (user_id, qualification, specialty, category, experience_years, license_number, bio, availability)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, qualification || null, specialty || null, category || null, experience_years || null, license_number || null, bio || null, availability ? JSON.stringify(availability) : null]
      );
    }
    
    res.status(200).json({ message: "Professional profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfessionalPic = async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imagePath = `/uploads/profiles/${req.file.filename}`;

  try {
    const [existing] = await db.query('SELECT id FROM professional_details WHERE user_id = ?', [userId]);

    if (existing.length > 0) {
      await db.query('UPDATE professional_details SET profile_pic_path = ? WHERE user_id = ?', [imagePath, userId]);
    } else {
      await db.query('INSERT INTO professional_details (user_id, profile_pic_path) VALUES (?, ?)', [userId, imagePath]);
    }

    res.json({ message: 'Profile picture uploaded successfully', profile_pic_path: imagePath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
