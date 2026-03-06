const db = require('../config/db');

// Process Mock Payment
const processPayment = async (req, res) => {
  const { appointmentId } = req.params;
  console.log(`[PAYMENT] Processing for App ID: ${appointmentId}`);

  try {
    await db.query(
      "UPDATE appointments SET payment_status = 'paid' WHERE id = ?",
      [appointmentId]
    );
    console.log(`[PAYMENT] Success for App ID: ${appointmentId}`);
    res.json({ message: "Payment successful! Your appointment is now fully activated." });
  } catch (err) {
    console.error(`[PAYMENT] Export failed: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Get Doctor Earnings
const getDoctorEarnings = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT 
        SUM(doctor_earning) as total_earned,
        COUNT(*) as total_paid_appointments,
        (SELECT SUM(amount) FROM withdrawals WHERE doctor_id = ? AND status = 'approved') as total_withdrawn
       FROM appointments 
       WHERE professional_id = ? AND payment_status = 'paid'`,
      [doctorId, doctorId]
    );

    const stats = rows[0];
    const availableBalance = (stats.total_earned || 0) - (stats.total_withdrawn || 0);

    res.json({
      total_earned: stats.total_earned || 0,
      total_paid_appointments: stats.total_paid_appointments || 0,
      total_withdrawn: stats.total_withdrawn || 0,
      available_balance: availableBalance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Request Withdrawal
const requestWithdrawal = async (req, res) => {
  const { doctorId, amount } = req.body;
  try {
    const [rows] = await db.query(
      `SELECT 
        (SUM(doctor_earning) - COALESCE((SELECT SUM(amount) FROM withdrawals WHERE doctor_id = ? AND status = 'approved'), 0)) as balance
       FROM appointments 
       WHERE professional_id = ? AND payment_status = 'paid'`,
      [doctorId, doctorId]
    );

    const balance = rows[0].balance || 0;
    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient balance for withdrawal." });
    }

    await db.query(
      "INSERT INTO withdrawals (doctor_id, amount, status) VALUES (?, ?, 'pending')",
      [doctorId, amount]
    );
    res.json({ message: "Withdrawal request submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Admin Revenue
const getAdminRevenue = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        SUM(system_fee) as total_revenue,
        SUM(amount) as total_sales,
        COUNT(*) as total_paid_appointments
       FROM appointments 
       WHERE payment_status = 'paid'`
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Withdrawals
const getWithdrawals = async (req, res) => {
  const { doctorId } = req.query;
  try {
    let query = `
      SELECT w.*, u.username as doctor_name 
      FROM withdrawals w
      JOIN users u ON w.doctor_id = u.id
    `;
    const params = [];
    if (doctorId) {
      query += " WHERE w.doctor_id = ?";
      params.push(doctorId);
    }
    query += " ORDER BY w.created_at DESC";
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Withdrawal Status
const updateWithdrawalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query("UPDATE withdrawals SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: `Withdrawal request ${status}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  processPayment,
  getDoctorEarnings,
  requestWithdrawal,
  getAdminRevenue,
  getWithdrawals,
  updateWithdrawalStatus
};
