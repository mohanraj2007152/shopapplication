const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;







// const fs = require('fs');
// const path = require('path');
// const uuid = require('uuid')
// const Cart = require('./cart');
// const dbconn = require('../util/database')

// // const p = path.join(
// //   path.dirname(main.require.filename),
// //   'data',
// //   'products.json'
// // );

// // const getProductsFromFile = cb => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return dbconn.execute(
//       'INSERT INTO product (title, price,description, imageUrl ) VALUES (?, ?, ?, ?)',
//       [this.title, this.price, this.description, this.imageUrl]
//     );
   
//   }

//   static deleteById(id) {
    
//   }

//   static fetchAll() {
//     return dbconn.execute('SELECT * FROM product');
//   }

//   static findById(id) {

//     return dbconn.execute('SELECT * FROM product WHERE product.id = ?', [id]);
    
//   }











//   // save() {
//   //   getProductsFromFile(products => {
//   //     if (this.id) {
//   //       const existingProductIndex = products.findIndex(
//   //         prod => prod.id === this.id
//   //       );
//   //       const updatedProducts = [...products];
//   //       updatedProducts[existingProductIndex] = this;
//   //       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//   //         console.log(err);
//   //       });
//   //     } else {
//   //       this.id = uuid.v1().toString();
//   //       products.push(this);
//   //       fs.writeFile(p, JSON.stringify(products), err => {
//   //         console.log(err);
//   //       });
//   //     }
//   //   });
//   // }

//   // static deleteById(id) {
//   //   getProductsFromFile(products => {
//   //     const product = products.find(prod => prod.id === id);
//   //     const updatedProducts = products.filter(prod => prod.id !== id);
//   //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//   //       if (!err) {
//   //         Cart.deleteProduct(id, product.price);
//   //       }
//   //     });
//   //   });
//   // }

//   // static fetchAll(cb) {
//   //   getProductsFromFile(cb);
//   // }

//   // static findById(id, cb) {
//   //   getProductsFromFile(products => {
//   //     const product = products.find(p => p.id === id);
//   //     cb(product);
//   //   });
//   // }
// };
