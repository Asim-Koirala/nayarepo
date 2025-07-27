const Material = require('../models/material');
const Metal = require('../models/metal');

// Create a new metal
exports.createMetal = async (req, res) => {
  try {
    const { name, type, purityPercentage, materialid } = req.body;

    // Validate material ID and get unit price
    const material = await Material.findById(materialid);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Calculate prices
    const pricePerTola = material.unitPrice * (purityPercentage / 100);
    const basePricePerGram = pricePerTola / 11.664;

    // Create and save metal
    const metal = new Metal({
      name,
      type,
      purityPercentage,
      materialid,
      basePricePerGram,
      unitPrice: pricePerTola
    });

    await metal.save();

    return res.status(201).json({
      message: 'Metal created successfully',
      metal
    });
  } catch (err) {
    console.error('Create Metal Error:', err);
    return res.status(500).json({ error: 'Server error while creating metal' });
  }
};

// Get all metals
exports.getAllMetals = async (req, res) => {
  try {
    const metals = await Metal.find().populate('materialid');
    return res.status(200).json(metals);
  } catch (err) {
    console.error('Get All Metals Error:', err);
    return res.status(500).json({ error: 'Server error while fetching metals' });
  }
};

// Get single metal by ID
exports.getMetalById = async (req, res) => {
  try {
    const metal = await Metal.findById(req.params.id).populate('materialid');
    if (!metal) {
      return res.status(404).json({ error: 'Metal not found' });
    }
    return res.status(200).json(metal);
  } catch (err) {
    console.error('Get Metal By ID Error:', err);
    return res.status(500).json({ error: 'Server error while fetching metal' });
  }
};

// Update metal and recalculate prices
exports.updateMetal = async (req, res) => {
  try {
    const { name, type, purityPercentage, materialid } = req.body;

    // Validate material existence
    const material = await Material.findById(materialid);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const pricePerTola = material.unitPrice * (purityPercentage / 100);
    const basePricePerGram = pricePerTola / 11.664;

    const updatedMetal = await Metal.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        purityPercentage,
        materialid,
        basePricePerGram,
        unitPrice: pricePerTola
      },
      { new: true, runValidators: true }
    ).populate('materialid');

    if (!updatedMetal) {
      return res.status(404).json({ error: 'Metal not found' });
    }

    return res.status(200).json({
      message: 'Metal updated successfully',
      metal: updatedMetal
    });
  } catch (err) {
    console.error('Update Metal Error:', err);
    return res.status(400).json({ error: 'Failed to update metal' });
  }
};

// Delete metal
exports.deleteMetal = async (req, res) => {
  try {
    const deletedMetal = await Metal.findByIdAndDelete(req.params.id);
    if (!deletedMetal) {
      return res.status(404).json({ error: 'Metal not found' });
    }

    return res.status(200).json({ message: 'Metal deleted successfully' });
  } catch (err) {
    console.error('Delete Metal Error:', err);
    return res.status(500).json({ error: 'Server error while deleting metal' });
  }
};
