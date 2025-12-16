const express = require('express');
const { getDonors, addDonor } = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/donors - Get all donors (Admin/Hospital only)
router.get('/', protect, authorize('admin', 'hospital'), getDonors);

// POST /api/donors - Add new donor (All authenticated users)
router.post('/', protect, addDonor);

module.exports = router;