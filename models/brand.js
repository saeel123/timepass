const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

const BrandSchema = mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Brand Id is required']
  },
  name: {
    type: String,
    unique: [true, 'Brand name already exist'],
    required: [true, 'Brand name is required'],
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: 1
  }
});

const Brand = module.exports = mongoose.model('Brand', BrandSchema);

module.exports.addBrand = function (newBrand, callback) {
      newBrand.save(callback);
}

module.exports.getBrandById = function (id, callback) {
  const query = {id: id}
  Brand.findOne(query, callback);
}

module.exports.deleteBrand = function (brand, callback) {
  const query = { $set: {status: 0}};
  brand.update(query, callback);
}
