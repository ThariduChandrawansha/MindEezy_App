const express = require('express');
const router = express.Router();
const { 
  createAssessment, 
  getDoctorAssessments, 
  getAllAssessments,
  getAssessmentById,
  submitResponse,
  getDoctorResponses,
  getCustomerResponses
} = require('../controllers/assessmentController');

router.post('/', createAssessment);
router.get('/', getAllAssessments);
router.get('/doctor/:doctorId', getDoctorAssessments);
router.get('/doctor/:doctorId/responses', getDoctorResponses);
router.get('/customer/:userId/responses', getCustomerResponses);
router.get('/:id', getAssessmentById);
router.post('/:id/respond', submitResponse);

module.exports = router;
