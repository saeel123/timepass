const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

const SupplierSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: [true, 'Sale Id is required']
  },
  customer_id: {
    type: String,
    required: [true, 'Customer Id is required']
  },
  products: [products],
  tax: {
    type: Number,
    min: 0
  },
  total_amount: {
    type: Number,
    min: 0
  },
  date: {
    type: Date,
    required: [true, 'Sale Date is required']
  },
  transport_amount: {
    type: Number,
    min: 0
  }
});

const Sale = module.exports = mongoose.model('Sale', SaleSchema);

module.exports.addSale = function (newSale, callback) {
      newSale.save(callback);
}
