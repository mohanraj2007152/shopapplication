const Product = require('../models/product');
const uuid = require('uuid')


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log("--->"+req.user.id);
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
     console.log(err);
   });

  // manully set the userid in create product 
//     Product.create({
//        title:title,
//        price:price,
//        imageUrl:imageUrl,
//        description:description,
//        userId : req.user.id
//     }).then(result =>{
//       console.log("product is created");
//       res.redirect('/admin/products');
//     }).catch(err =>{
//       console.log(err);
//     });



};

//   const product = new Product(null, title, imageUrl, description, price);
//   product
//     .save()
//     .then(() => {
//       res.redirect('/');
//     })
//     .catch(err => console.log(err));
// };


// exports.postAddProduct = (req, res, next) => {
//   const title = req.body.title;
//   const imageUrl = req.body.imageUrl;
//   const price = req.body.price;
//   const description = req.body.description;
//   const product = new Product(null, title, imageUrl, description, price);
//   product.save()
//     .then(() => {
//       res.redirect('/');
//     })
//     .catch(err => console.log(err));
//   //product.save();
//   //res.redirect('/');
// };

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
      product: product
    });
  }).catch(err =>{console.log(err)});
  // Product.findByPk(prodId, product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

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
     console.log(err);
   });
 
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  //Product.findAll()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err =>{
    console.log(err)
  });


  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product =>{
    return product.destroy();
  }).then(result =>{
    console.log("product is deleted");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });;
  
};
