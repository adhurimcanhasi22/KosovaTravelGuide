const express = require('express');
const router = express.Router();

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear token cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
