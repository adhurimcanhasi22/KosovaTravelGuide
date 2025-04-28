require('./config/db');
const express = require('express');
const cors = require('cors');
const UserRouter = require('./api/User');

const app = express();
const port = 5000;

// CORS middleware should come FIRST
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Frontend
      // 'https://your-production-domain.com' // Add this later
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/user', UserRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
