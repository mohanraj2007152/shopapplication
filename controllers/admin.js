const Product = require('../models/product');
const uuid = require('uuid')
const { validationResult }=require('express-validator/check')

exports.createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // if (!req.file) {
  //   const error = new Error('No image provided.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;


  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result => {
    // console.log(result);
    res.status(201).json({
      message: 'Post created successfully!',
      post: result
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.updateProduct = (req, res, next) => {
  console.log('updateProduct --> called')
   const prodId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  
  Product.findByPk(prodId).then(product =>{
    if(!product){
      res.status(500).json({ message: 'product is not found .' });
    }
    product.title = req.body.title;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl =updatedImageUrl;
    return product.save();

  }).then(result =>{
    res.status(200).json({ message: 'Post updated!', post: result });
   }).catch(err =>{
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

//fetch all products 
exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(products=>{
    res.status(200)
    .json({ message: 'Fetched Products successfully.', products: products });
  }).catch(err =>{
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

//fetch product by id
exports.getProductById = (req, res, next) => {
  console.log("getProduct is called -->");
  console.log("getProduct is called -->"+req.params.productId);
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if(!product){
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({message:"product fetched ", product:product})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
     });
  };



exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product =>{
    return product.destroy();
  })
  // .then(result =>{
  //   console.log("product is deleted");
  //   res.redirect('/admin/products');
  // })
  .then(() => {
    res.status(200).json({ message: 'DESTROYED PRODUCT Success!' });
  })
  .catch(err => {
    res.status(500).json({ message: 'Deleting product failed.' });
  });
  
};
