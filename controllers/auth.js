const User = require("../models/user");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer =require('nodemailer');
const sendgrid_mail_service = require('nodemailer-sendgrid-transport');

const {validationResult} =require('express-validator/check');



const transporter = nodemailer.createTransport(sendgrid_mail_service({
  auth:{
    api_key :'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'
  }
  
}));

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
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
   const email =req.body.email;
   const password = req.body.password;

   const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
    }
   User.findOne({ where : { email : email }})
   .then( user =>{
     if(!user){
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password.',
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
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
       return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password.',
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });

     })
   })
   .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
   });
       
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
      errorMessage: message,
      oldInput: {
        name :'',
        email: '',
        password: '',
        confirmPassword: ''
      },
      validationErrors: []
     
    });
  };

  exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const email =req.body.email;
    const errors = validationResult(req);
    console.log("-->"+errors);

    if(!errors.isEmpty()){
      console.log(errors.array());
      return res.status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name : name,
          email: email,
          password: password,
          confirmPassword: ''
        },
        validationErrors: errors.array()
    
      });
    }

    
      bcrypt.hash(password,12)
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
         
         return transporter.sendMail({
           to:email,
           from :'mohanraj.cgi@gmail.com',
           subject: 'Signup Success',
           html:'<h1> HI you Successfully signed into shopApp.com <h1>'
            
         }).then(result =>{
          res.redirect('/login');
         }).catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
         });
      })
     
    //})
    

  };


  
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ where:{ email: req.body.email } })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          res.render('auth/reset', {
            path: '/reset',
            pageTitle: 'Reset Password',
            errorMessage: 'No account with that email found.'
          });
          
        }else{
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        }
              
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'mohanraj.cgi@gmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:4200/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      });
  });
};


exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user.id,
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
     });
};
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  console.log('------------------>' +newPassword);
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({ where :{
    resetToken: passwordToken
    //resetTokenExpiration: { $gt: Date.now() }
    //id: userId
  }})
    .then(user => {
      console.log(user.body)
      resetUser = user;
      console.log(resetUser.body)
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      //console.log('hashedPassword =' +hashedPassword )
      resetUser.password = hashedPassword;
      console.log('resetUser.password -->' +resetUser.password);
      //resetUser.resetToken = undefined;
      //resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
     });
};
