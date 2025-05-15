require('dotenv').config();
require('./config/db');
const express = require('express');
const cors = require('cors');
const UserRouter = require('./api/User');
const AdminRouter = require('./api/admin'); // Import the admin router

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'https://kosovatravelguide.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the user router at /user
app.use('/user', UserRouter);

// Mount the admin router at /admin
app.use('/admin', AdminRouter); // Use the AdminRouter here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
