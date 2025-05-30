// ./api/admin.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // Import your middlewares
const City = require('../models/City'); // Import your City model
const Accommodation = require('../models/Accommodation'); // Import your Accommodation model
const Tour = require('../models/Tour'); // Import your Tour model (create this if you haven't)
const TravelTip = require('../models/TravelTip'); // NEW: Import your TravelTip model

// @desc    Create a new accommodation
// @route   POST /api/admin/accommodations
// @access  Private/Admin
router.post('/accommodations', protect, admin, async (req, res) => {
  try {
    const {
      id,
      name,
      image,
      location,
      type,
      price,
      rating,
      features,
      bookingUrl,
    } = req.body; // Added bookingUrl

    // Basic input validation
    if (!id || !name || !location || !type || !price) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Missing required fields' });
    }

    // Check if accommodation with this ID already exists
    const accommodationExists = await Accommodation.findOne({ id });
    if (accommodationExists) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Accommodation with this ID already exists',
      });
    }

    const newAccommodation = new Accommodation({
      id, // Use the provided ID
      name,
      image,
      location,
      type,
      price,
      rating,
      features,
      bookingUrl, // Save the new field
    });

    const createdAccommodation = await newAccommodation.save();
    res.status(201).json({
      status: 'SUCCESS',
      message: 'Accommodation created successfully',
      data: createdAccommodation,
    });
  } catch (error) {
    console.error('Error creating accommodation:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error creating accommodation',
    });
  }
});

// @desc    Get all accommodations
// @route   GET /api/admin/accommodations
// @access  Private/Admin
router.get('/accommodations', protect, admin, async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json({ status: 'SUCCESS', data: accommodations });
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching accommodations',
    });
  }
});

// @desc    Get a single accommodation by ID
// @route   GET /api/admin/accommodations/:id
// @access  Private/Admin
router.get('/accommodations/:id', protect, admin, async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({ id: req.params.id }); // Find by the string 'id'
    if (!accommodation) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Accommodation not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: accommodation });
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching accommodation',
    });
  }
});

// @desc    Update an accommodation by ID
// @route   PUT /api/admin/accommodations/:id
// @access  Private/Admin
router.put('/accommodations/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, location, type, price, rating, features, bookingUrl } =
      req.body; // Added bookingUrl

    // Basic input validation
    if (
      !name &&
      !image &&
      !location &&
      !type &&
      !price &&
      !rating &&
      !features &&
      !bookingUrl
    ) {
      // Added bookingUrl
      return res.status(400).json({
        status: 'FAILED',
        message: 'At least one field to update is required',
      });
    }

    const accommodation = await Accommodation.findOneAndUpdate(
      { id },
      {
        name,
        image,
        location,
        type,
        price,
        rating,
        features,
        bookingUrl, // Update the new field
      },
      { new: true, runValidators: true }
    ); // Return the updated document, run validators

    if (!accommodation) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Accommodation not found' });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Accommodation updated successfully',
      data: accommodation,
    });
  } catch (error) {
    console.error('Error updating accommodation:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'FAILED', message: error.message });
    }
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error updating accommodation',
    });
  }
});

// @desc    Delete an accommodation by ID
// @route   DELETE /api/admin/accommodations/:id
// @access  Private/Admin
router.delete('/accommodations/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAccommodation = await Accommodation.findOneAndDelete({ id });

    if (!deletedAccommodation) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Accommodation not found' });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Accommodation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error deleting accommodation',
    });
  }
});

// --- City Routes (Admin Only) ---

// @desc    Create a new city
// @route   POST /api/admin/destinations
// @access  Private/Admin
router.post('/destinations', protect, admin, async (req, res) => {
  try {
    const {
      name,
      slug,
      region,
      image,
      description,
      longDescription,
      coordinates,
      attributes,
      thingsToDo,
      images,
    } = req.body;

    // Basic input validation -  Added slug validation
    if (!name || !slug) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Missing required fields' });
    }
    // Check if slug is unique
    const slugExists = await City.findOne({ slug });
    if (slugExists) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Slug already exists' });
    }

    const newCity = new City({
      name,
      slug,
      region,
      image,
      description,
      longDescription,
      coordinates,
      attributes,
      thingsToDo,
      images,
    });

    const createdCity = await newCity.save();
    res.status(201).json({
      status: 'SUCCESS',
      message: 'City created successfully',
      data: createdCity,
    });
  } catch (error) {
    console.error('Error creating city:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error creating city' });
  }
});

// @desc    Get all cities
// @route   GET /api/admin/destinations
// @access  Private/Admin
router.get('/destinations', protect, admin, async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json({ status: 'SUCCESS', data: cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching cities' });
  }
});

// @desc    Get a single city by slug
// @route   GET /api/admin/destinations/:slug
// @access  Private/Admin
router.get('/destinations/:slug', protect, admin, async (req, res) => {
  try {
    const { slug } = req.params;
    const city = await City.findOne({ slug });
    if (!city) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'City not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: city });
  } catch (error) {
    console.error('Error fetching city:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching city' });
  }
});

// @desc    Update a city by slug
// @route   PUT /api/admin/destinations/:slug
// @access  Private/Admin
router.put('/destinations/:slug', protect, admin, async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      name,
      region,
      image,
      description,
      longDescription,
      coordinates,
      attributes,
      thingsToDo,
      images,
    } = req.body;

    // Basic input validation
    if (
      !name &&
      !region &&
      !image &&
      !description &&
      !longDescription &&
      !coordinates &&
      !attributes &&
      !thingsToDo &&
      !images
    ) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'At least one field to update is required',
      });
    }
    const updatedCity = await City.findOneAndUpdate(
      { slug },
      {
        name,
        region,
        image,
        description,
        longDescription,
        coordinates,
        attributes,
        thingsToDo,
        images,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCity) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'City not found' });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'City updated successfully',
      data: updatedCity,
    });
  } catch (error) {
    console.error('Error updating city:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'FAILED', message: error.message });
    }
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error updating city' });
  }
});

// @desc    Delete a city by slug
// @route   DELETE /api/admin/destinations/:slug
// @access  Private/Admin
router.delete('/destinations/:slug', protect, admin, async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedCity = await City.findOneAndDelete({ slug });

    if (!deletedCity) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'City not found' });
    }

    res
      .status(200)
      .json({ status: 'SUCCESS', message: 'City deleted successfully' });
  } catch (error) {
    console.error('Error deleting city:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error deleting city' });
  }
});

// @desc    Create a new tour
// @route   POST /api/admin/tours
// @access  Private/Admin
router.post('/tours', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      date,
      location,
      images,
      id,
      duration,
      groupSize,
    } = req.body;

    // Basic input validation - now including date
    if (
      !id ||
      !name ||
      !description ||
      !price ||
      !date ||
      !location ||
      !duration ||
      !groupSize
    ) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Missing required fields' });
    }

    const newTour = new Tour({
      id,
      name,
      description,
      price,
      date,
      location,
      images,
      duration,
      groupSize,
    });

    const createdTour = await newTour.save();
    res.status(201).json({
      status: 'SUCCESS',
      message: 'Tour created successfully',
      data: createdTour,
    });
  } catch (error) {
    console.error('Error creating tour:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'FAILED', message: error.message });
    } else if (error.code === 11000) {
      // MongoDB duplicate key error for 'id'
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Tour ID already exists.' });
    }
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error creating tour' });
  }
});
// @desc    Get all tours
// @route   GET /api/admin/tours
// @access  Private/Admin
router.get('/tours', protect, admin, async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({ status: 'SUCCESS', data: tours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching tours' });
  }
});

// @desc    Get a single tour by your custom ID
// @route   GET /api/admin/tours/:id
// @access  Private/Admin
router.get('/tours/:id', protect, admin, async (req, res) => {
  try {
    const tour = await Tour.findOne({ id: req.params.id }); // Use findOne with a query object
    if (!tour) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Tour not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: tour });
  } catch (error) {
    console.error('Error fetching tour:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching tour' });
  }
});

// @desc    Update a tour by your custom ID
// @route   PUT /api/admin/tours/:id
// @access  Private/Admin
router.put('/tours/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      date,
      location,
      images,
      duration,
      groupSize,
    } = req.body; // Include all relevant fields

    const updatedTour = await Tour.findOneAndUpdate(
      { id: req.params.id }, // Query by your custom ID
      {
        name,
        description,
        price,
        date,
        location,
        images,
        duration,
        groupSize,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTour) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Tour not found' });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Tour updated successfully',
      data: updatedTour,
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'FAILED', message: error.message });
    }
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error updating tour' });
  }
});

// @desc    Delete a tour by your custom ID
// @route   DELETE /api/admin/tours/:id
// @access  Private/Admin
router.delete('/tours/:id', protect, admin, async (req, res) => {
  try {
    const deletedTour = await Tour.findOneAndDelete({ id: req.params.id }); // Query by your custom ID

    if (!deletedTour) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Tour not found' });
    }

    res
      .status(200)
      .json({ status: 'SUCCESS', message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error deleting tour' });
  }
});

// --- Travel Tip Routes (Admin Only) ---
// @desc    Create a new travel tip
// @route   POST /api/admin/traveltips
// @access  Private/Admin
router.post('/traveltips', protect, admin, async (req, res) => {
  try {
    const { id, title, icon, content, list } = req.body;

    // Basic input validation
    if (!id || !title || !icon || !content) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Missing required fields: id, title, icon, content',
      });
    }

    // Check if travel tip with this ID already exists
    const travelTipExists = await TravelTip.findOne({ id });
    if (travelTipExists) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Travel tip with this ID already exists.',
      });
    }

    const newTravelTip = new TravelTip({
      id,
      title,
      icon,
      content,
      list: list || [], // Ensure list is an array, default to empty if not provided
    });

    const createdTravelTip = await newTravelTip.save();
    res.status(201).json({
      status: 'SUCCESS',
      message: 'Travel tip created successfully',
      data: createdTravelTip,
    });
  } catch (error) {
    console.error('Error creating travel tip:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'FAILED', message: error.message });
    } else if (error.code === 11000) {
      // MongoDB duplicate key error for 'id'
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Travel tip ID already exists.' });
    }
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error creating travel tip' });
  }
});

// @desc    Get all travel tips
// @route   GET /api/admin/traveltips
// @access  Private/Admin
router.get('/traveltips', protect, admin, async (req, res) => {
  try {
    const travelTips = await TravelTip.find();
    res.status(200).json({ status: 'SUCCESS', data: travelTips });
  } catch (error) {
    console.error('Error fetching travel tips:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching travel tips' });
  }
});

// @desc    Get a single travel tip by ID
// @route   GET /api/admin/traveltips/:id
// @access  Private/Admin
router.get('/traveltips/:id', protect, admin, async (req, res) => {
  try {
    const travelTip = await TravelTip.findOne({ id: req.params.id }); // Find by the string 'id'
    if (!travelTip) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Travel tip not found' });
    }
    res.status(200).json({ status: 'SUCCESS', data: travelTip });
  } catch (error) {
    console.error('Error fetching travel tip:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching travel tip' });
  }
});

// @desc    Update a travel tip by ID
// @route   PUT /api/admin/traveltips/:id
// @access  Private/Admin
router.put('/traveltips/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon, content, list } = req.body;

    // Basic input validation - at least one field to update
    if (!title && !icon && !content && !list) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'At least one field to update is required',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (icon !== undefined) updateData.icon = icon;
    if (content !== undefined) updateData.content = content;
    if (list !== undefined) updateData.list = list; // Expecting list to be an array

    const updatedTravelTip = await TravelTip.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTravelTip) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Travel tip not found' });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Travel tip updated successfully',
      data: updatedTravelTip,
    });
  } catch (error) {
    console.error('Error updating travel tip:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'FAILED', message: error.message });
    }
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error updating travel tip' });
  }
});

// @desc    Delete a travel tip by ID
// @route   DELETE /api/admin/traveltips/:id
// @access  Private/Admin
router.delete('/traveltips/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTravelTip = await TravelTip.findOneAndDelete({ id });

    if (!deletedTravelTip) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'Travel tip not found' });
    }

    res
      .status(200)
      .json({ status: 'SUCCESS', message: 'Travel tip deleted successfully' });
  } catch (error) {
    console.error('Error deleting travel tip:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error deleting travel tip' });
  }
});

module.exports = router;
