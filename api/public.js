const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation');
const City = require('../models/City'); // Assuming you have this model for destinations
const Tour = require('../models/Tour'); // Assuming you have this model for tours
const TravelTip = require('../models/TravelTip'); // Assuming you have this model for travel tips
const Restaurant = require('../models/Restaurant');

// --- Accommodation Routes (Publicly accessible) ---

// @desc    Get all accommodations
// @route   GET /api/public/accommodations
// @access  Public
router.get('/accommodations', async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json({ status: 'SUCCESS', data: accommodations });
  } catch (error) {
    console.error('Error fetching public accommodations:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching public accommodations',
    });
  }
});

// NEW: @desc    Get a single accommodation by its custom ID (string 'id' field)
// NEW: @route   GET /api/public/accommodations/:id
// NEW: @access  Public
router.get('/accommodations/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({ id: req.params.id }); // Find by the string 'id'
    if (!accommodation) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Accommodation not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: accommodation });
  } catch (error) {
    console.error('Error fetching public accommodation by ID:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching public accommodation',
    });
  }
});

// --- Destination Routes (Publicly accessible) ---

// @desc    Get all destinations (cities)
// @route   GET /api/public/destinations
// @access  Public
router.get('/destinations', async (req, res) => {
  try {
    const destinations = await City.find(); // Assuming City model represents destinations
    res.status(200).json({ status: 'SUCCESS', data: destinations });
  } catch (error) {
    console.error('Error fetching public destinations:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching public destinations',
    });
  }
});

// @desc    Get a single destination (city) by slug
// @route   GET /api/public/destinations/:slug
// @access  Public
router.get('/destinations/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const destination = await City.findOne({ slug }); // Find by slug
    if (!destination) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Destination not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: destination });
  } catch (error) {
    console.error('Error fetching public destination by slug:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching destination' });
  }
});

// --- Travel Tips Routes (Publicly accessible) ---

// @desc    Get all travel tips
// @route   GET /api/public/traveltips
// @access  Public
router.get('/traveltips', async (req, res) => {
  try {
    const travelTips = await TravelTip.find();
    res.status(200).json({ status: 'SUCCESS', data: travelTips });
  } catch (error) {
    console.error('Error fetching public travel tips:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching travel tips' });
  }
});

// --- Tour Routes (Publicly accessible) ---

// @desc    Get all tours
// @route   GET /api/public/tours
// @access  Public
router.get('/tours', async (req, res) => {
  try {
    const tours = await Tour.find(); // Assuming Tour model
    res.status(200).json({ status: 'SUCCESS', data: tours });
  } catch (error) {
    console.error('Error fetching public tours:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching tours' });
  }
});

// NEW: @desc    Get a single tour by its custom ID (string 'id' field)
// NEW: @route   GET /api/public/tours/:id
// NEW: @access  Public
router.get('/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.findOne({ id: req.params.id }); // Find by the string 'id'
    if (!tour) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Tour not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: tour });
  } catch (error) {
    console.error('Error fetching public tour by ID:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching public tour',
    });
  }
});

// --- Restaurant Routes (Publicly accessible) ---

// @desc    Get all restaurants
// @route   GET /api/public/restaurants
// @access  Public
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ status: 'SUCCESS', data: restaurants });
  } catch (error) {
    console.error('Error fetching public restaurants:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching public restaurants',
    });
  }
});

// NEW: @desc    Get a single restaurant by its custom ID (string 'id' field)
// NEW: @route   GET /api/public/restaurants/:id
// NEW: @access  Public
router.get('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: req.params.id }); // Find by the string 'id'
    if (!restaurant) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Restaurant not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: restaurant });
  } catch (error) {
    console.error('Error fetching public restaurant by ID:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching public restaurant',
    });
  }
});

module.exports = router;
