const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authControler = require('../Controlers/auth');
const User = require('../Models/User');



// PUT /auth/signup
router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value , {req}) => {
                return User.findOne({email: value}).then(userdoc => {
                    if(userdoc){
                        return Promise.reject('E-mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('name').trim().isLength({min:3}).not().isEmpty(),
        body('password').trim().isLength({min: 6})
    ],
    authControler.signup 
);

// POST /auth/login
router.post('/login', authControler.login);

module.exports = router;