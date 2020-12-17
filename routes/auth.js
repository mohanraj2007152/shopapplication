const express = require('express');

const User = require('../models/user')

const {check, body} =require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup',  authController.getSignup);

router.post('/signup',
[
    check('email').isEmail().withMessage('Please enter valid email.')
.custom((value,{req})=>{

    return User.findOne({ where :{email:value } }).then(exitUser => {
        if (exitUser) {
          return Promise.reject().catch(()=>{
              throw new Error('E-Mail exists already, please pick a different one!')
          });
        }
      });
    }).normalizeEmail(),    
      
body('password', 'Please ender valid password only numbers and text with min 5 char').trim().isLength({min:5}).isAlphanumeric(),
body('confirmPassword').trim()
.custom((value,{req}) =>{
    if(value !== req.body.password){
      throw new Error('password and confirm password doesnot match');
    }
    return true;
})], 
authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;