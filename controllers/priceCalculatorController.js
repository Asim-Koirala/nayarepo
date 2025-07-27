const PriceCalculator = require('../models/priceCalculator');
const Material = require('../models/material');
const Metal = require('../models/metal');
const {
  convertToGrams,
  calculateMakingValue,
  calculateMaterialTotal
} = require('../utils/priceCalculatorUtil');

// 🔧 Utility function to calculate price dynamically
function calculateFinalPrice(inputItems, materials, metals) {
  const calculatedItems = [];
  let grandTotal = 0;

  const materialMap = new Map(materials.map(m => [m._id.toString(), m]));
  const metalMap = new Map(metals.map(m => [m._id.toString(), m]));

  for (const item of inputItems) {
    const material = materialMap.get(item.materialid.toString());
    const metal = metalMap.get(item.metalid.toString());

    if (!material || !metal) {
      throw new Error('Material or Metal not found for given ID');
    }

    const weightInGrams = convertToGrams(item.weight, item.unit);
    const unitPrice = metal.unitPrice || 0;
    const makingValue = calculateMakingValue(item.makingCharge, item.makingUnit, weightInGrams, unitPrice);
    const discountPercentage = material.discount || 0;
    const totalPrice = calculateMaterialTotal(weightInGrams, unitPrice, makingValue, discountPercentage);

    calculatedItems.push({
      materialid: item.materialid,
      metalid: item.metalid,
      weight: item.weight,
      unit: item.unit,
      makingCharge: item.makingCharge,
      makingUnit: item.makingUnit,
      discount: discountPercentage,
      totalPrice: parseFloat(totalPrice.toFixed(2))
    });

    grandTotal += totalPrice;
  }

  return {
    items: calculatedItems,
    grandTotal: parseFloat(grandTotal.toFixed(2))
  };
}

// 📌 POST: Create new price calculation
exports.createCalculation = async (req, res) => {
  try {
    const inputItems = req.body.materialData;
    const materialIds = inputItems.map(item => item.materialid);
    const metalIds = inputItems.map(item => item.metalid);

    const materials = await Material.find({ _id: { $in: materialIds } }).lean();
    const metals = await Metal.find({ _id: { $in: metalIds } }).lean();

    const { items: calculatedItems, grandTotal } = calculateFinalPrice(inputItems, materials, metals);

    const newCalculation = new PriceCalculator({
      materialData: calculatedItems,
      grandTotal
    });

    await newCalculation.save();
    res.status(201).json(newCalculation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 GET: All price calculations
exports.getAllCalculations = async (req, res) => {
  try {
    const calculations = await PriceCalculator.find()
      .populate('materialData.materialid')
      .populate('materialData.metalid');
    res.status(200).json(calculations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 GET: Single price calculation by ID
exports.getCalculationById = async (req, res) => {
  try {
    const calculation = await PriceCalculator.findById(req.params.id)
      .populate('materialData.materialid')
      .populate('materialData.metalid');

    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    res.status(200).json(calculation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 PUT: Update existing calculation
exports.updateCalculation = async (req, res) => {
  try {
    const calculation = await PriceCalculator.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    const inputItems = req.body.materialData || calculation.materialData;
    const materialIds = inputItems.map(item => item.materialid);
    const metalIds = inputItems.map(item => item.metalid);

    const materials = await Material.find({ _id: { $in: materialIds } }).lean();
    const metals = await Metal.find({ _id: { $in: metalIds } }).lean();

    const { items: calculatedItems, grandTotal } = calculateFinalPrice(inputItems, materials, metals);

    calculation.materialData = calculatedItems;
    calculation.grandTotal = grandTotal;

    await calculation.save();
    res.status(200).json(calculation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 DELETE: Remove calculation by ID
exports.deleteCalculation = async (req, res) => {
  try {
    const calculation = await PriceCalculator.findByIdAndDelete(req.params.id);
    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    res.status(200).json({ message: 'Calculation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
