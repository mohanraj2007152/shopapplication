const Product = require('../models/product');
const uuid = require('uuid')
const { validationResult }=require('express-validator/check')

exports.getProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log("--->"+req.user.id);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      
      validationErrors: errors.array()
    });
  }


  // Using sequlize feature user object procide the function
   req.user.createProduct({
     title: title,
     price: price,
     imageUrl: imageUrl,
     description: description
   })
   .then(result => {
     // console.log(result);
    console.log('Created Product');
     res.redirect('/admin/products');
   })
   .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where:{id:prodId}})
  //Product.findByPk(prodId)
  .then(products =>{
    const product = products[0];
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  }).catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postEditProduct = (req, res, next) => {

  console.log('postEditProduct --> called')
  console.log('prodid = '+ req.body.productId +"title =" + req.body.title + "imageUrl = " + req.body.imageUrl +
  "price = " + req.body.price + "description" +req.body.description );
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
   Product.findByPk(prodId).then(product =>{
     product.title = updatedTitle;
     product.price = updatedPrice;
     product.description = updatedDesc;
     product.imageUrl =updatedImageUrl;
     return product.save();

   }).then(result =>{
     console.log("Product is updated");
     res.redirect('/admin/products');
    }).catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   });
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err =>{
    const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product =>{
    return product.destroy();
  }).then(result =>{
    console.log("product is deleted");
    res.redirect('/admin/products');
  }).catch(err => {
    const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });;
  
};
