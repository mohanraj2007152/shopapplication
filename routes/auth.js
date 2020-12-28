const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const isAuth = require('../middleware/is-auth')
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ where :{email:value } }).then(exitUser => {
          if (exitUser) {
            return Promise.reject().catch(()=>{
                throw new Error('E-Mail exists already, please pick a different one!')
            });
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/user', isAuth, authController.getUserStatus);

router.put('/user', isAuth, authController.updateUserStatus);

module.exports = router;
