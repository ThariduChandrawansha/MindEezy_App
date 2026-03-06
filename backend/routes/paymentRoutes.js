const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Mock Payment
router.post('/process/:appointmentId', paymentController.processPayment);

// Doctor Platform
router.get('/doctor/earnings/:doctorId', paymentController.getDoctorEarnings);
router.post('/doctor/withdraw', paymentController.requestWithdrawal);
router.get('/doctor/withdrawals', paymentController.getWithdrawals);

// Admin Platform
router.get('/admin/revenue', paymentController.getAdminRevenue);
router.get('/admin/withdrawals', paymentController.getWithdrawals);
router.put('/admin/withdrawals/:id', paymentController.updateWithdrawalStatus);

module.exports = router;
