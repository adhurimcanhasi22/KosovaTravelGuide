const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');

// Protected route
router.get('/dashboard', authenticateUser, (req, res) => {
  res.json({ message: 'Welcome to your dashboard', user: req.user });
});

module.exports = router;
