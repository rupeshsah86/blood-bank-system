const BloodRequest = require('../models/BloodRequest');

// Create blood request
const createBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.create({
      ...req.body,
      requester: req.user._id
    });
    res.status(201).json({ success: true, data: bloodRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all blood requests
const getBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find().populate('requester', 'name email');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update request status (Admin only)
const updateRequestStatus = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createBloodRequest, getBloodRequests, updateRequestStatus };