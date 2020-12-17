const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/isAuthenticated');

const { body } = require('express-validator/check');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',[
    body('title','Title min 3 char')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'URL not valid').isURL(),
    body('price','price not valid').isFloat(),
    body('description','description min 3 char and max 400 char')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product',[
    body('title','Title min 3 char')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'URL not valid').isURL(),
    body('price','price not valid').isFloat(),
    body('description','description min 3 char and max 400 char')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth, adminController.postEditProduct);

router.delete('/delete-product/:productId', adminController.deleteProduct);

module.exports = router;
