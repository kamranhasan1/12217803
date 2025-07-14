require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// Import your pre-test logging middleware here
const { loggingMiddleware } = require('./your-pretest-middleware-path');
const urlRoutes = require('./routes/urls');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use your pre-test logging middleware as the first middleware after basic Express middleware
app.use(loggingMiddleware);

// Routes
app.use('/', urlRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
