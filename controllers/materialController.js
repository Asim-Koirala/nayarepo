const Material = require('../models/material');

// Create new material
exports.createMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    return res.status(201).json({
      message: 'Material created successfully',
      material,
    });
  } catch (err) {
    console.error('Create Material Error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// Get all materials
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    return res.status(200).json({
      status: 'success',
      message: 'Materials fetched successfully',
      materials,
    });
  } catch (err) {
    console.error('Get Materials Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get single material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.status(200).json(material);
  } catch (err) {
    console.error('Get Material By ID Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Update material by ID
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Check for each field before updating
    if (typeof updates.type !== 'undefined') material.type = updates.type;
    if (typeof updates.unitPrice !== 'undefined') material.unitPrice = updates.unitPrice;
    if (typeof updates.discount !== 'undefined') material.discount = updates.discount;

    await material.save();

    return res.status(200).json({
      message: 'Material updated successfully',
      material,
    });
  } catch (err) {
    console.error('Update Material Error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// Delete material by ID
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await Material.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.error('Delete Material Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
