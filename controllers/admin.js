const Product = require('../models/product');
const User = require('../models/user');
const uuid = require('uuid')
const io = require('../socket');
const { validationResult }=require('express-validator/check')

exports.createProduct = (req, res, next) => {
  console.log("@@@@@@@@@@@@@"+req.userId)
  const errors = validationResult(req);
  console.log(JSON.stringify(errors));
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const imageUrl = req.file.path.replace("\\" ,"/");
  //const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const content = req.body.content;
  const userId = req.userId;

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    content:  content,
    userId: userId
  }).then(result =>{
    console.log('io called on create');
    console.log(result);
    //console.log(JSON.stringify({...result}));
    io.getIO().emit('posts', {
      action: 'create',
     // post: { ...result, creator: { id: req.userId, name: user.name } }
     
      post: result
    });
  })
  .then(result => {
    // console.log(result);
    res.status(201).json({
      message: 'Product created successfully!',
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
  console.log('updateProduct --> called' +req.body.id)
  const prodId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedContent = req.body.content;

  let updatedImageUrl = req.body.image;
  if (req.file) {
    updatedImageUrl = req.file.path;
  }
  if (!updatedImageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

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
    if(product.userId !==req.userId){
      const error = new Error('Not authorized')
      error.statusCode=403;
      throw error;

    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.content = updatedContent;
    product.imageUrl =updatedImageUrl;
    return product.save();

  }).then(result =>{
    res.status(200).json({ message: 'Product updated!', post: result });
   }).catch(err =>{
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

//fetch all products 
exports.getProducts = (req, res, next) => {
  //console.log("*****************"+req.query.page)
  const currentPage = Number(req.query.page) || 1;
 // console.log("*****************"+currentPage)
  const perPage = 5;
  let totalItems;
  const userId = req.userId;

   Product
   .findAndCountAll({
      // where: {
      //  userId: userId        
      // },
      offset: currentPage,
      limit: perPage
   })


  // Product
  // .findAll({
  //    where: {
  //     userId: userId        
  //    },
  //    offset: currentPage,
  //    limit: perPage
  // })


 // req.user.getProducts()
  .then(products=>{
    //console.log(products)
    res.status(200)
    //creater:getCreaterName(userId)
    .json({ message: 'Fetched Products successfully.', posts: products});
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
      res.status(200).json({message:"product fetched ", post:product})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
     });
  };



exports.deleteProduct = (req, res, next) => {
  console.log('deleteproduct is called ')
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product =>{
    
    if(product.userId !== req.userId){
       console.log("called inside")
       const error = new Error('Not authorized')
       error.statusCode=403;
       throw error;

     }
    //clearImage(product.imageUrl);
    return product.destroy();
  })
  
  .then(() => {
    console.log('DESTROYED PRODUCT Success!')
    res.status(200).json({ message: 'DESTROYED PRODUCT Success!' });
  })
  .catch(err => {
    res.status(500).json({ message: 'Deleting product failed.' });
  });
  
};

const clearImage = filePath => {
  //console.log(filePath);
  filePath = path.join(__dirname, '..', filePath);
  console.log(filePath);
  fs.unlink(filePath, err => console.log(err));
};

// const getCreaterName = userId =>{
//   User.findByPk(userId).then(user=>{
//     if(!user){
//       const error = new Error('User Not Found')
//       error.statusCode=403;
//       throw error;
//     }
//     console.log(user.name);
//     res.status(200).json({username:user.name});
//   }).catch(err => {
//     res.status(500).json({ message: 'User Not Found.' });
//   });

// }