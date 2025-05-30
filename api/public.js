const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation'); // Import your Accommodation model

// @desc    Get all accommodations (Publicly accessible)
// @route   GET /api/public/accommodations
// @access  Public
router.get('/accommodations', async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json({ status: 'SUCCESS', data: accommodations });
  } catch (error) {
    console.error('Error fetching public accommodations:', error);
    res
      .status(500)
      .json({
        status: 'FAILED',
        message: 'Server error fetching public accommodations',
      });
  }
});

module.exports = router;
