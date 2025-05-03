const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure environment variables are loaded

const protect = (req, res, next) => {
  let token;

  // Check for Authorization header and if it starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (split 'Bearer <token>' and take the token part)
      token = req.headers.authorization.split(" ")[1];

      // Verify token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info (from token payload) to the request object
      // You might want to fetch the full user from DB here if needed, but for basic auth, payload is often enough
      req.user = decoded; // Contains { userId, email, iat, exp } from generateToken

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res
        .status(401)
        .json({ status: "FAILED", message: "Not authorized, token failed" });
    }
  }

  // If no token is found in the header
  if (!token) {
    res
      .status(401)
      .json({ status: "FAILED", message: "Not authorized, no token" });
  }
};

module.exports = { protect };
