const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');


const { body } = require('express-validator');

const router = express.Router();

//fetch all
router.get('/products', adminController.getProducts);
//fetch by id

router.get('/product/:productId', adminController.getProductById);
router.get('/edit-product/:productId', adminController.getProductById);

router.post('/product',[
  body('title','Title min 3 char')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('imageUrl', 'URL not valid').isURL(),
  body('price','price not valid').isFloat(),
  body('description','description min 3 char and max 400 char')
    .isLength({ min: 5, max: 400 })
    .trim()
],adminController.createProduct);

router.put('/product',[
  body('title','Title min 3 char')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('imageUrl', 'URL not valid').isURL(),
  body('price','price not valid').isFloat(),
  body('description','description min 3 char and max 400 char')
    .isLength({ min: 5, max: 400 })
    .trim()
], adminController.updateProduct);

router.delete('/product/:productId', adminController.deleteProduct)


module.exports = router;
