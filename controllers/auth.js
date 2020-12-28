const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  console.log("signup  called")
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const status = "New User for the application";
  
  bcrypt.hash(password,12)
      .then(encriptPassword =>{
        const user = new User({
          name :name,
          password :encriptPassword,
          email :email,
          status : status
        })
        return user.save();
  
      })
  
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result.id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne( { where: { email: email }})
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      console.log("password "+ password +"db.password  " +user.password)
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id
        },
        'secret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser.id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};




  exports.getUserStatus= (req, res, next) => {
       User.findByPk(req.userId).then(user=>{
         if(!user){
           const error = new Error('User Not Found')
           error.statusCode=403;
           throw error;
         }
         console.log(user.status);
         res.status(200).json({status:user.status});
       }).catch(err => {
         res.status(500).json({ message: 'User Not Found.' });
       });
    
     }

     exports.updateUserStatus= (req, res, next) => {
      const updateStatus = req.body.status;
      console.log('updatestatus   ' +updateStatus);
      User.findByPk(req.userId).then(user=>{
        if(!user){
          const error = new Error('User Not Found')
          error.statusCode=403;
          throw error;
        }
        user.status = updateStatus;
        user.save();
        console.log(user.status);
        res.status(200).json({status:user.status});
      }).catch(err => {
        res.status(500).json({ message: 'User Not Found.' });
      });
   
    }