const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin')

const Product = require('./models/product');
const User = require('./models/user'); 

const app =express();

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.use((req,res,next) =>{
    User.findByPk(1).then(user =>{
      if(!user){
          const user = new User({
            name :'mohan',
            password :'mohan123',
            email :'mohan0045@gmail.com'
          })
          return user.save();
      }
      req.user =user;
      console.log(req.user.id);
      next();
    }).catch(err =>{
      console.log(err);
    });
  })


app.use('/admin', adminRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//one - to - many
User.hasMany(Product);



sequelize
//.sync({ force: true })
  .sync()
  .then(result =>{
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });