const express = require('express');
const router = express.Router();
const {
  createMetal,
  getAllMetals,
  getMetalById,
  updateMetal,
  deleteMetal
} = require('../controllers/metalController');

router.post('/', createMetal);
router.get('/', getAllMetals);
router.get('/:id', getMetalById);
router.put('/:id', updateMetal);
router.delete('/:id', deleteMetal);

module.exports = router;
