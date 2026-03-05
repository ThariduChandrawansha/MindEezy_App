const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Create User with Profile
exports.createUser = async (req, res) => {
  const { username, email, password, role, profileData } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check if user exists
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into users
    const [userResult] = await connection.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    const userId = userResult.insertId;

    // Based on role, insert into details tables
    if (role === 'customer') {
      await connection.execute(
        'INSERT INTO patient_details (user_id, age, gender, address, phone, medical_history, stress_triggers, profile_pic_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, profileData.age || null, profileData.gender || null, profileData.address || '', profileData.phone || '', profileData.medical_history || '', profileData.stress_triggers || '', profileData.profile_pic_path || '']
      );
    } else if (role === 'doctor' || role === 'professional') {
      await connection.execute(
        'INSERT INTO professional_details (user_id, qualification, specialty, experience_years, license_number, bio, profile_pic_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, profileData.qualification || '', profileData.specialty || '', profileData.experience_years || 0, profileData.license_number || '', profileData.bio || '', profileData.profile_pic_path || '']
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error during user creation' });
  } finally {
    connection.release();
  }
};

// Get All Users with Basic Info
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get Single User with Profile
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await db.execute('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = users[0];
    let profile = null;

    if (user.role === 'customer') {
      const [p] = await db.execute('SELECT * FROM patient_details WHERE user_id = ?', [id]);
      profile = p[0] || {};
    } else if (user.role === 'doctor' || user.role === 'professional') {
      const [p] = await db.execute('SELECT * FROM professional_details WHERE user_id = ?', [id]);
      profile = p[0] || {};
    }

    res.json({ ...user, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching user details' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role, profileData } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );

    if (role === 'customer') {
      await connection.execute(
        'INSERT INTO patient_details (user_id, age, gender, address, phone, medical_history, stress_triggers, profile_pic_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE age=?, gender=?, address=?, phone=?, medical_history=?, stress_triggers=?, profile_pic_path=?',
        [id, profileData.age, profileData.gender, profileData.address, profileData.phone, profileData.medical_history, profileData.stress_triggers, profileData.profile_pic_path, profileData.age, profileData.gender, profileData.address, profileData.phone, profileData.medical_history, profileData.stress_triggers, profileData.profile_pic_path]
      );
    } else if (role === 'doctor' || role === 'professional') {
      await connection.execute(
        'INSERT INTO professional_details (user_id, qualification, specialty, experience_years, license_number, bio, profile_pic_path) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE qualification=?, specialty=?, experience_years=?, license_number=?, bio=?, profile_pic_path=?',
        [id, profileData.qualification, profileData.specialty, profileData.experience_years, profileData.license_number, profileData.bio, profileData.profile_pic_path, profileData.qualification, profileData.specialty, profileData.experience_years, profileData.license_number, profileData.bio, profileData.profile_pic_path]
      );
    }

    await connection.commit();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error updating user' });
  } finally {
    connection.release();
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};
