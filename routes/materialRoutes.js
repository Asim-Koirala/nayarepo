const express = require('express');
const router = express.Router();
const { createMaterial, getMaterials, updateMaterial, getMaterialById, deleteMaterial } = require('../controllers/materialController');

// Create a new material
router.post('/', createMaterial);

// Get all materials
router.get('/', getMaterials);

// Get a single material by ID
router.get('/:id', getMaterialById);

// Update a material by ID
router.put('/:id', updateMaterial);

// Delete a material by ID
router.delete('/:id', deleteMaterial);

module.exports = router;
