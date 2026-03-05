const db = require('../config/db');

// Get overview of journals for a specific month
exports.getMonthOverview = async (req, res) => {
  const { userId } = req.params;
  const { year, month } = req.query; // e.g. year=2024, month=03

  try {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`; // SQL handles valid day max

    const [moods] = await db.query(
      `SELECT mood_date as date, mood_level, note FROM moods 
       WHERE user_id = ? AND mood_date >= ? AND mood_date <= ?`,
      [userId, startDate, endDate]
    );

    const [journals] = await db.query(
      `SELECT journal_date as date, 1 as hasContent FROM journals 
       WHERE user_id = ? AND journal_date >= ? AND journal_date <= ?`,
      [userId, startDate, endDate]
    );

    // Combine them into a single map by date
    const mergedData = {};
    
    moods.forEach(m => {
      // Create local date string (YYYY-MM-DD) bypassing timezone shift
      const d = new Date(m.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      mergedData[dateStr] = { ...mergedData[dateStr], mood_level: m.mood_level, hasMood: !!m.mood_level };
    });

    journals.forEach(j => {
      const d = new Date(j.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      mergedData[dateStr] = { ...mergedData[dateStr], hasJournal: true };
    });

    res.json(mergedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all journals for a user (useful for AI summary)
exports.getAllEntries = async (req, res) => {
  const { userId } = req.params;

  try {
    const [journals] = await db.query(
      'SELECT journal_date, entry FROM journals WHERE user_id = ? ORDER BY journal_date DESC LIMIT 50',
      [userId]
    );

    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get specific day's journal and mood
exports.getDayEntry = async (req, res) => {
  const { userId, date } = req.params;

  try {
    const [moodData] = await db.query(
      'SELECT mood_level, note FROM moods WHERE user_id = ? AND mood_date = ?',
      [userId, date]
    );

    const [journalData] = await db.query(
      'SELECT entry FROM journals WHERE user_id = ? AND journal_date = ?',
      [userId, date]
    );

    res.json({
      mood_level: moodData[0]?.mood_level || 0,
      note: moodData[0]?.note || '',
      entry: journalData[0]?.entry || ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update/Create entry for a specific day
exports.saveDayEntry = async (req, res) => {
  const { userId, date } = req.params;
  const { mood_level, note, entry } = req.body;

  try {
    // Upsert Mood
    if (mood_level || note) {
      await db.query(
        `INSERT INTO moods (user_id, mood_date, mood_level, note) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE mood_level = VALUES(mood_level), note = VALUES(note)`,
        [userId, date, mood_level || null, note || '']
      );
    }

    // Upsert Journal
    if (entry !== undefined && entry !== null) {
      // Find if exists first because journals index is not explicitly UNIQUE on user_date like moods
      // It has INDEX idx_user_date (user_id, journal_date) but not UNIQUE. Let's do a safe select/update pattern
      const [existing] = await db.query('SELECT id FROM journals WHERE user_id = ? AND journal_date = ?', [userId, date]);
      
      if (existing.length > 0) {
        await db.query('UPDATE journals SET entry = ? WHERE id = ?', [entry, existing[0].id]);
      } else {
        await db.query('INSERT INTO journals (user_id, journal_date, entry) VALUES (?, ?, ?)', [userId, date, entry]);
      }
    }

    res.json({ message: 'Saved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
