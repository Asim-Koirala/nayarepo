const mongoose = require('mongoose');

// Embedded schema for each material entry
const materialEntrySchema = new mongoose.Schema({
  materialid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  },
  metalid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Metal',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['gm', 'tola', 'carat'],
    required: true
  },
  makingUnit: {
    type: String,
    enum: ['gm', 'tola', 'percentage'],
    required: true
  },
  makingCharge: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number, // percentage (e.g., 5 means 5%)
    default: 0
  },
  totalPrice: {
    type: Number
  }
});

// Convert all weights to grams for base calculations
function convertToGrams(weight, unit) {
  switch (unit) {
    case 'tola': return weight * 11.664;
    case 'carat': return weight * 0.2;
    case 'gm':
    default: return weight;
  }
}

// Calculate making charge value based on selected unit
function calculateMakingValue(makingCharge, makingUnit, weightInGrams, basePricePerGram) {
  switch (makingUnit) {
    case 'gm':
      return makingCharge * weightInGrams;
    case 'tola':
      const weightInTola = weightInGrams / 11.664;
      return makingCharge * weightInTola;
    case 'percentage':
      return (makingCharge / 100) * (basePricePerGram * weightInGrams);
    default:
      return 0;
  }
}

// Main Price Calculator schema
const priceCalculatorSchema = new mongoose.Schema({
  materialData: [materialEntrySchema],
  grandTotal: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save hook to calculate prices
priceCalculatorSchema.pre('save', async function (next) {
  try {
    const Metal = mongoose.model('Metal');
    let overallTotal = 0;

    for (const entry of this.materialData) {
      const metal = await Metal.findById(entry.metalid);
      if (!metal) {
        throw new Error('Metal not found');
      }

      const weightInGrams = convertToGrams(entry.weight, entry.unit);
      const unitPrice = metal.unitPrice;

      // Calculate base price
      const basePrice = weightInGrams * unitPrice;

      // Calculate making cost
      const makingCost = calculateMakingValue(entry.makingCharge, entry.makingUnit, weightInGrams, unitPrice);

      // Apply discount if any
      const discountAmount = (entry.discount / 100) * basePrice;

      // Final price
      const totalPrice = basePrice + makingCost - discountAmount;
      entry.totalPrice = parseFloat(totalPrice.toFixed(2));
      overallTotal += totalPrice;
    }

    this.grandTotal = parseFloat(overallTotal.toFixed(2));
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('PriceCalculator', priceCalculatorSchema);
