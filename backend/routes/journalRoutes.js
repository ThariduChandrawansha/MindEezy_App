const express = require('express');
const router = express.Router();
const {
  getMonthOverview,
  getDayEntry,
  saveDayEntry,
  getAllEntries
} = require('../controllers/journalController');

router.get('/:userId/all', getAllEntries);
router.get('/:userId/month', getMonthOverview);
router.get('/:userId/date/:date', getDayEntry);
router.post('/:userId/date/:date', saveDayEntry);

// For professionals to view patient progress
const { getPatientMonthOverview, getPatientDayEntry, getPatientAllEntries } = require('../controllers/journalController');
router.get('/professional/:doctorId/patient/:patientId/month', getPatientMonthOverview);
router.get('/professional/:doctorId/patient/:patientId/date/:date', getPatientDayEntry);
router.get('/professional/:doctorId/patient/:patientId/all', getPatientAllEntries);

module.exports = router;
