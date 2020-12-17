const path = require('path');
const cookieParser = require('cookie-parser');
const session =require('express-session');
const SessionStore=require('express-session-sequelize')(session.Store); 
const csrf = require('csurf');
const flash = require('connect-flash');
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

const sequelizeSessionStore = new SessionStore({
  db: sequelize,
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { Console } = require('console');

const csrfProduction = csrf();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: 'supersecret',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized : false , 
}));

app.use(csrfProduction);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  if(req.user){
  res.locals.user =req.user.name;
  }
  next();
});


app.use((req,res,next) =>{
  if(!req.session.user){
    return next();
  }
  User.findByPk(req.session.user.id).then(user =>{
    if(!user){
      return next();
    }
    req.user =user;
    next();
  }).catch(err =>{
    next(new Error(err));
  });
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.get500);

app.use(errorController.get404);



app.use((error, req, res, next) => {
  res.redirect('/500');
});





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
    app.listen(4200);
  })
  .catch(err => {
    console.log(err);
  });

