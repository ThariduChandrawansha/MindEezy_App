const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      ['Admin User', 'admin@psycare.com', hashedPassword, 'admin'],
      ['Dr. Smith', 'doctor@psycare.com', hashedPassword, 'doctor'],
      ['John Doe', 'customer@psycare.com', hashedPassword, 'customer']
    ];

    for (const user of users) {
      const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [user[1]]);
      if (existing.length === 0) {
        await db.execute(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          user
        );
        console.log(`User ${user[1]} seeded.`);
      } else {
        console.log(`User ${user[1]} already exists.`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
}

seedUsers();
