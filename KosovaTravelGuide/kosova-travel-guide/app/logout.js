const express = require('express');
const router = express.Router();

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear token cookie
  res.status(200).json({ message: 'Logged out successfully' });
});
const handleLogout = async () => {
  try {
    await axios.post('/auth/logout');
    router.push('/auth/login');
  } catch (error) {
    console.error(error);
    alert('Logout failed. Please try again.');
  }
};
module.exports = router;
