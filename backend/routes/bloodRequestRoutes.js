const express = require('express');
const { createBloodRequest, getBloodRequests, updateRequestStatus, getUserRequests } = require('../controllers/bloodRequestController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// POST /api/requests - Create blood request (All authenticated users)
router.post('/', protect, createBloodRequest);

// GET /api/requests - Get requests (All authenticated users can see their own)
router.get('/', protect, getBloodRequests);

// GET /api/requests/my - Get user's own requests
router.get('/my', protect, getUserRequests);

// PUT /api/requests/:id - Update request status (Admin only)
router.put('/:id', protect, authorize('admin'), updateRequestStatus);

module.exports = router;