const User = require("../models/user");
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
   const email =req.body.email;
   const password = req.body.password;

   
   User.findOne({ where : { email : email }})
   .then( user =>{
     if(!user){
      req.flash('error', 'Invalid email.');
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      return res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: 'Invalid email.'
      });
       // res.render('/login');
     }
     bcrypt.compare(password, user.password)
     .then(compared =>{
       if(compared){
        req.session.isLoggedIn=true;
        req.session.user =user;
        return req.session.save(err =>{
          console.log(err);
          res.redirect('/')
        })
       }
       req.flash('error', 'Invalid password.');
       return res.redirect('/login');
     })
   })
   .catch( err => {
     console.log(err);
   })
       
  };


  exports.postLogout = (req, res, next) => {
    req.session.destroy(()=>{
      res.redirect('/');
    });   
  };
  
  exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message
     
    });
  };

  exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const email =req.body.email;
    
    User.findOne({ where :{email:email } }).then(exitUser =>{
      if(exitUser){
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password,12)
      .then(encriptPassword =>{
        const user = new User({
          name :name,
          password :encriptPassword,
          email :email
        })
        return user.save();
  
      })
      .then(user =>{
        console.log("cart is created");
           return user.createCart();
      })
      .then(result =>{
        return res.redirect('/login');
      })
     
    })
    .catch(err =>{
      console.log(err);
    });

  };