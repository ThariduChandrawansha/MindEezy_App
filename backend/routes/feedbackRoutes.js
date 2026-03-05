const express = require('express');
const router = express.Router();
const { submitFeedback, getDoctorFeedbacks, checkFeedback } = require('../controllers/feedbackController');

router.post('/', submitFeedback);
router.get('/doctor/:doctorId', getDoctorFeedbacks);
router.get('/appointment/:appointmentId', checkFeedback);

module.exports = router;
