// netlify/functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors'); // Make sure to include cors
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables

const app = express();

// Enable CORS (Important for your Next.js frontend)
const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      ['https://kosovatravelguide.netlify.app/'].includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// --- Your Express API routes ---
// Example route
app.get('/hello', (req, res) => {
  res.send('Hello from Netlify Functions!');
});

// ---  MongoDB Connection (Important!) ---
const mongoose = require('mongoose'); // If you're using Mongoose
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
connectDB();

// Mount your existing Express routes (from User.js, etc.)
//  Make sure the paths are correct
const userRoutes = require('../../api/User'); // Adjust the path!
app.use('/', userRoutes);

// --- Wrap your Express app with serverless-http ---
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // Run connectDB() here, before handling the request
  await connectDB(); //  Await the connection
  return handler(event, context);
};
