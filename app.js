const path = require('path');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');




const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { Console } = require('console');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) =>{
  User.findByPk(1).then(user =>{
    
    req.user =user;
    console.log(req.user.id);
    next();
  }).catch(err =>{
    console.log(err);
  });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
//relationship using sequalize
//many-to-one
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//one - to - many
User.hasMany(Product);
// one - to -one 
User.hasOne(Cart);
// one -to -one (bi direction its optional)
Cart.belongsTo(User);
//many - to -many
Cart.belongsToMany(Product,{through :CartItem});
//many - to -many (reverce )
Product.belongsToMany(Cart,{through :CartItem});

Order.belongsTo(User);

User.hasMany(Order);

Order.belongsToMany(Product, {through : OrderItem});


sequelize
//.sync({ force: true })
  .sync()
  .then(result =>{
    return User.findByPk(1);
  })
  .then(user =>{
    if(!user){
      return User.create({name:'mohan',email:'mohan0045@gmail.com'});
    }else{
      return user;
    }    
  })
  .then(user => {
     console.log("sequlize creating tables");
    return user.createCart();
    
  }).then(cart =>{
    app.listen(4200);
  })
  .catch(err => {
    console.log(err);
  });

//app.listen(3000);
