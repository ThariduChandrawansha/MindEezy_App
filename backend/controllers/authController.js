const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Reuse transporter logic if possible, or define here for student project
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f8d9e65e4572fa",
    pass: "d939ec85d4c750"
  }
});

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user (role defaults to 'customer')
    await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'customer']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.status === 'deactive') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Fetch the profile picture from patient_details or professional_details based on role
    let profilePicPath = null;
    if (user.role === 'customer') {
      const [patient] = await db.execute('SELECT profile_pic_path FROM patient_details WHERE user_id = ?', [user.id]);
      if (patient.length > 0) profilePicPath = patient[0].profile_pic_path;
    } else if (user.role === 'doctor') {
      const [prof] = await db.execute('SELECT profile_pic_path FROM professional_details WHERE user_id = ?', [user.id]);
      if (prof.length > 0) profilePicPath = prof[0].profile_pic_path;
    }

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_pic_path: profilePicPath
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Identity not found in our records.' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    const mailOptions = {
      from: '"MindEezy Security" <security@mindeezy.com>',
      to: email,
      subject: 'Secure Access Recovery',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; background: #ffffff;">
           <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #2563eb; font-weight: 900; letter-spacing: -0.05em;">MindEezy</h2>
           </div>
           <h3 style="color: #0f172a; font-weight: 800;">Password Reset Requested</h3>
           <p style="color: #64748b; line-height: 1.6;">We received a request to access your MindEezy account. If you didn't make this request, you can safely ignore this email.</p>
           <div style="margin: 32px 0; text-align: center;">
              <a href="${resetLink}" style="background: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">Reset Password</a>
           </div>
           <p style="color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; pt-20; margin-top: 40px;">This is a demonstration of the MindEezy security infrastructure. Link expires in 15 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'A recovery link has been dispatched to your registered email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process recovery request.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    res.json({ message: 'Password has been successfully updated. You can now sign in.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired recovery token.' });
  }
};
