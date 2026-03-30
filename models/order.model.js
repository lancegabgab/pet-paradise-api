const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

