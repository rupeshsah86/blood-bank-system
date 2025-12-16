const express = require('express');
const { createBloodRequest, getBloodRequests, updateRequestStatus } = require('../controllers/bloodRequestController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// POST /api/requests - Create blood request (All authenticated users)
router.post('/', protect, createBloodRequest);

// GET /api/requests - Get all requests (Admin/Hospital only)
router.get('/', protect, authorize('admin', 'hospital'), getBloodRequests);

// PUT /api/requests/:id - Update request status (Admin only)
router.put('/:id', protect, authorize('admin'), updateRequestStatus);

module.exports = router;