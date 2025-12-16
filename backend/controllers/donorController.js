const Donor = require('../models/Donor');

// Get all donors
const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json({ success: true, data: donors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new donor
const addDonor = async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json({ success: true, data: donor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getDonors, addDonor };