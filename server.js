const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth');

const Product = require('./models/product');
const User = require('./models/user'); 
const { Socket } = require('dgram');

const app =express();

const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuidv4())
  }
});



const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  //  app.use((req,res,next) =>{
  //    if(!req.body.userId){
  //      throw new Error("user not Exit so we cannot create , update or find product");

  //    }
  //    User.findByPk(req.body.userId).then(user =>{
  //     //  if(!user){
  //     //      const user = new User({
  //     //        name :'mohan',
  //     //        password :'mohan123',
  //     //        email :'mohan0045@gmail.com'
  //     //      })
  //     //      return user.save();
  //     //  }
  //     if(!user){
  //       throw new Error("user not Exit so we cannot create , update or find product");
  //     }
  //      req.user =user;
  //      console.log(req.user.id);
  //      next();
  //    }).catch(err =>{
  //      console.log(err);
  //    });
  //  })


app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message });
  });


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//one - to - many
User.hasMany(Product);



sequelize
//.sync({ force: true })
 .sync()
  .then(result =>{
    const socketServer =app.listen(8080);
    const io = require('./socket').init(socketServer);
    io.on('connection', socket => {
       console.log('Client connected successfully');
    })
   
  })
  .catch(err => {
    console.log(err);
  });