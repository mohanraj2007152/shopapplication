const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //const isLoggedIn =req.get('Cookie').split('=')[1] ==='true';
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
    //req.isLoggedIn = true;
    User.findByPk(1)
    .then(user =>{
      req.session.isLoggedIn=true;
      req.session.user =user;
      req.session.save(err =>{
        console.log(err);
        res.redirect('/');
      })
      
    })
    .catch(err => {
      console.log(err);
    });
   
    //res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
    
  };

  exports.postLogout = (req, res, next) => {
    req.session.destroy(()=>{
      res.redirect('/');
    });   
  };
