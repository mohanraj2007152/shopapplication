const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


const { body } = require('express-validator');

const router = express.Router();

//fetch all
router.get('/products',isAuth, adminController.getProducts);
//fetch by id

router.get('/product/:productId',isAuth, adminController.getProductById);
router.get('/edit-product/:productId',isAuth, adminController.getProductById);

router.post('/product',[
  body('title','Title min 2 char')
    .isString()
    .isLength({ min: 2 })
    .trim(),
  //body('image', 'URL not valid').isString(),
  body('price','price not valid').isFloat(),
  body('content','content min 5 char and max 400 char')
    .isLength({ min: 5, max: 400 })
    .trim()
], isAuth, adminController.createProduct);

router.put('/product', isAuth, adminController.updateProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct)


module.exports = router;
