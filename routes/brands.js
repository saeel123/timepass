const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const permission = require('permission');

const Brand = require('../models/brand');
const User = require('../models/user');
const config = require('../config/database');
const uuidv4 = require('uuid/v4');
const Role = 0;
const middleware = require('../middleware.js')(User, Role);
const validation = require('../validations/validations');


router.post('/add', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  let newBrand = new Brand({
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description
  });

  Brand.addBrand(newBrand, function(err, brand) {
    var errors = [];

    if (err) {
      if (err.name === 'ValidationError') {

        if (err.errors['name']) {
          errors.push(err.errors['name'].message);
        }

        if (err.errors['id']) {
          errors.push(err.errors['id'].message);
        }

      } else {
        if (err.name === 'MongoError' && err.code === 11000) {
          errors.push("Brand name Exist");
        } else {
          errors.push('Failed to add Please check your input');
        }
      }

      res.json({
        success: false,
        msg: errors
      });

    } else {
      res.json({
        success: true,
        msg: "Brand Added Successfully"
      });
    }
  });

});

router.put('delete/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
  var id = req.params.id;

  if (id) {
    Brand.getBrandById(id, function (err, brand) {
      if (err) {
        res.json({
          success: false,
          msg: "No brand available with this ID"
        });
      } else {

        if (brand.status === true) {
          Brand.deleteBrand(brand, function (err, brand) {
            if (err) {
              res.json({
                success: true,
                msg: "Failed to delete Brand"
              });
            } else {
              res.json({
                success: true,
                msg: "Brand Deleted Successfully"
              });
            }
          });
        } else {
          res.json({
            success: false,
            msg: "Brand Deleted Already"
          });
        }
      }
    });
  } else {
    res.json({
      success: false,
      msg: "No brand available with this ID"
    });
  }
});

router.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    Brand.getAllBrands(function (err, brands) {

      if (err) {
        res.json({
          success: false,
          msg: "Error Occured while fetching"
        });
      } else if (brands) {
        const brandsArray = [];

        for (var i = 0; i < brands.length; i++) {
          const brandObj = Brand.tailorBrandObj(brands[i]);
          brandsArray.push(brandObj);
        }

        res.json({
          success: true,
          msg: "Brands Fetched Successfully",
          data: brandsArray
        });
      } else {
        res.json({
          success: false,
          msg: "No Brands Available."
        });
      }
    });
});

router.get('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var id = req.params.id;

    Brand.getBrandById(id,function (err, brand) {
      if (err) {
        res.json({
          success: false,
          msg: "Error Occured while fetching"
        });
      } else if (brand) {

        const brandObj =  Brand.tailorBrandObj(brand)

        res.json({
          success: true,
          msg: "Brand Fetched Successfully",
          data: brandObj
        });
      } else {
        res.json({
          success: false,
          msg: "No Brand Available."
        });
      }
    });
});

module.exports = router;
