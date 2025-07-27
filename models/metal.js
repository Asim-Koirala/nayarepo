const mongoose = require('mongoose');

const metalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['gold', 'silver', 'diamond']
  },
  type: {
    type: String,
    required: true
  },
  purityPercentage: {
    type: Number,
    required: true
  },
  basePricePerGram: {
    type: Number,
    
  },
  unitPrice: {
    type: Number
  },
  materialid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Metal', metalSchema);
