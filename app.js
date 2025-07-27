const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Route Imports
const materialRoutes = require('./routes/materialRoutes');
const metalRoutes = require('./routes/metalRoutes');
const priceCalculatorRoutes = require('./routes/priceCalculatorRoutes');
const productRoutes = require('./routes/productRoutes');

// Load environment variables from .env
dotenv.config();

// DB Connection
const connectDB = require('./config/db');
connectDB(); // connect to MongoDB

// Initialize Express App
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount API Routes
app.use('/api/materials', materialRoutes);
app.use('/api/metals', metalRoutes);
app.use('/api/price-calculator', priceCalculatorRoutes);
app.use('/api/product', productRoutes); // Make sure createProduct is defined in productController

// Default Home Route
app.get('/', (req, res) => {
  res.send('💎 Jewelry Price Calculator API is Running...');
});

// Global Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
