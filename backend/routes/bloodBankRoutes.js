const express = require('express');
const { getBloodStock, addBloodStock, updateBloodStock } = require('../controllers/bloodBankController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/bloodbank - Get blood stock (All users)
router.get('/', protect, getBloodStock);

// POST /api/bloodbank - Add blood stock (Admin only)
router.post('/', protect, authorize('admin'), addBloodStock);

// PUT /api/bloodbank/:id - Update blood stock (Admin only)
router.put('/:id', protect, authorize('admin'), updateBloodStock);

module.exports = router;