require('dotenv').config(); // in case you use .env file
require('./config/db');
const express = require('express');
const cors = require('cors');
const UserRouter = require('./api/User');

const app = express();
const port = process.env.PORT || 5000;

// CORS middleware — must come before routes
app.use(
  cors({
    origin: 'https://kosovatravelguide.vercel.app', // Frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', UserRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
