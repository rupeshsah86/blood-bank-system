const BloodBank = require('../models/BloodBank');

// Get all blood stock
const getBloodStock = async (req, res) => {
  try {
    const bloodStock = await BloodBank.find();
    res.json({ success: true, data: bloodStock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add blood stock
const addBloodStock = async (req, res) => {
  try {
    const bloodStock = await BloodBank.create(req.body);
    res.status(201).json({ success: true, data: bloodStock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update blood stock
const updateBloodStock = async (req, res) => {
  try {
    const bloodStock = await BloodBank.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!bloodStock) {
      return res.status(404).json({ success: false, message: 'Blood stock not found' });
    }
    res.json({ success: true, data: bloodStock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getBloodStock, addBloodStock, updateBloodStock };