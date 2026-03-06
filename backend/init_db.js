const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} checked/created.`);

    await connection.query(`USE ${process.env.DB_NAME}`);

    // Drop tables in reverse order of dependencies to ensure clean start
    const tablesToDrop = [
      'blogs', 'blog_categories', 'appointments', 'assessment_responses', 
      'assessments', 'journals', 'moods', 'professional_details', 
      'patient_details', 'users'
    ];
    
    for (const table of tablesToDrop) {
      await connection.query(`DROP TABLE IF EXISTS ${table}`);
    }
    console.log('Old tables dropped for fresh migration.');

    // 1. Users Table
    const createUserTable = `
      CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'doctor', 'professional', 'admin') NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `;
    await connection.query(createUserTable);
    console.log('1. Users table created.');

    // 2. Patient Details Table
    const createPatientTable = `
      CREATE TABLE patient_details (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL UNIQUE,
        age INT UNSIGNED,
        gender ENUM('male', 'female', 'non-binary', 'prefer_not_to_say'),
        address VARCHAR(255),
        phone VARCHAR(20),
        medical_history TEXT,
        stress_triggers TEXT,
        profile_pic_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createPatientTable);
    console.log('2. Patient Details table created.');

    // 3. Professional Details Table
    const createProfessionalTable = `
      CREATE TABLE professional_details (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL UNIQUE,
        qualification VARCHAR(255),
        specialty VARCHAR(255),
        category ENUM('Psychiatrist', 'Psychologist', 'Counselor'),
        experience_years INT UNSIGNED,
        license_number VARCHAR(100),
        bio TEXT,
        profile_pic_path TEXT,
        availability JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createProfessionalTable);
    console.log('3. Professional Details table created.');

    // 4. Moods Table
    const createMoodsTable = `
      CREATE TABLE moods (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        mood_date DATE NOT NULL,
        mood_level INT,
        note TEXT,
        sentiment_score DECIMAL(5,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_mood_date (user_id, mood_date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createMoodsTable);
    console.log('4. Moods table created.');

    // 5. Journals Table
    const createJournalsTable = `
      CREATE TABLE journals (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        journal_date DATE NOT NULL,
        entry MEDIUMTEXT NOT NULL,
        sentiment_analysis JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_date (user_id, journal_date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createJournalsTable);
    console.log('5. Journals table created.');

    // 6. Assessments Table
    const createAssessmentsTable = `
      CREATE TABLE assessments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        professional_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        questions JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createAssessmentsTable);
    console.log('6. Assessments table created.');

    // 7. Assessment Responses Table
    const createResponsesTable = `
      CREATE TABLE assessment_responses (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        assessment_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        responses JSON,
        score DECIMAL(5,2),
        response_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        INDEX idx_user_assessment (user_id, assessment_id),
        FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createResponsesTable);
    console.log('7. Assessment Responses table created.');

    // 8. Appointments Table
    const createAppointmentsTable = `
      CREATE TABLE appointments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        professional_id INT UNSIGNED NOT NULL,
        appointment_datetime DATETIME NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY prof_appoint_time (professional_id, appointment_datetime),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createAppointmentsTable);
    console.log('8. Appointments table created.');

    // 9. Blog Categories Table
    const createBlogCategoriesTable = `
      CREATE TABLE blog_categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        cat_image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createBlogCategoriesTable);
    console.log('9. Blog Categories table created.');

    // 10. Blogs Table
    const createBlogsTable = `
      CREATE TABLE blogs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id INT UNSIGNED,
        author_id INT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        content MEDIUMTEXT NOT NULL,
        publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        image_path_1 TEXT,
        image_path_2 TEXT,
        image_path_3 TEXT,
        status ENUM('draft', 'published') DEFAULT 'draft',
        views INT DEFAULT 0,
        FULLTEXT idx_search (title, content),
        FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createBlogsTable);
    console.log('10. Blogs table created.');

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDB();
