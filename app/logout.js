const express = require('express');
const router = express.Router();

// Logout Route
router.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token'); // Ensure the cookie name matches what you used in the login route

  // Respond with success message
  res.json({ status: 'SUCCESS', message: 'Logged out successfully' });
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
