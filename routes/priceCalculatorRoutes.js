const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createCalculation,
  getAllCalculations,
  getCalculationById,
  updateCalculation,
  deleteCalculation
} = require('../controllers/priceCalculatorController');

// @route   POST /api/price-calculator
// @desc    Create a new price calculation
router.post('/', createCalculation);

// @route   GET /api/price-calculator
// @desc    Get all price calculations
router.get('/', getAllCalculations);

// @route   GET /api/price-calculator/:id
// @desc    Get a specific price calculation by ID
router.get('/:id', getCalculationById);

// @route   PUT /api/price-calculator/:id
// @desc    Update an existing price calculation
router.put('/:id', updateCalculation);

// @route   DELETE /api/price-calculator/:id
// @desc    Delete a price calculation by ID
router.delete('/:id', deleteCalculation);

// Export the router
module.exports = router;
