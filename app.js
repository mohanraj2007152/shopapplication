const path = require('path');
const cookieParser = require('cookie-parser');
const session =require('express-session');
const SessionStore=require('express-session-sequelize')(session.Store); 
//const MySQLStore = require('connect-mssql-v2')(session);
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


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: 'supersecret',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized : false , 
}));


// var options = {
// 	//host: 'localhost',
// 	//port: 3306,
// 	user: 'root',
//   password: 'root',
//  // server:'DESKTOP-EFK517F',
//   server: 'localhost',
//   database: 'nodedb',
//   //"options": {
//     //"encrypt": true,
//     //"enableArithAbort": true
//     //},
//   schema: {
// 		tableName: 'sessions',
// 		columnNames: {
// 			sid: 'sid',
// 			session: 'session',
// 			expires: 'expires'
// 		}
// 	}
// };

// var sessionStore = new MySQLStore(options);

// app.use(
//   session({
// 	//key: 'session_cookie_name',
// 	secret: 'session_cookie_secret',
// 	store: sessionStore,
// 	resave: false,
// 	saveUninitialized: false
// })
// );

// app.use(session({
//   store: new MSSQLStore(config), // options are optional
//   secret: 'password'
// }));

//setting session
//app.use(session({secret:'password', resave:false, saveUninitialized:false, store:}))

app.use((req,res,next) =>{
  if(!req.session.user){
    return next();
  }
  
  User.findByPk(req.session.user.id).then(user =>{
    req.user =user;
      next();
  }).catch(err =>{
    console.log(err);
  });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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
