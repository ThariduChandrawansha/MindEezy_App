const express = require('express');
const router = express.Router();
const {
  getMonthOverview,
  getDayEntry,
  saveDayEntry
} = require('../controllers/journalController');

router.get('/:userId/month', getMonthOverview);
router.get('/:userId/date/:date', getDayEntry);
router.post('/:userId/date/:date', saveDayEntry);

module.exports = router;
