const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

// to send email 
const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: { api_key: 'key'}
    })
  );


// signup user
exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('! Validation failed !');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User ({
                name: name,
                password: hashedPass,
                email: email
            })
            return user.save();
        })
        .then(result => {
            return res.status(201).json({
                message: 'User created ...',
                userId: result._id
            })
        })
        .then(result => {
            //  send email to welcome the user
            return transporter.sendMail({
              from: 'note@gmail.com',
              to: email,
              subject: 'Welcome !!',
              html: '<h1>Hello </h1>'+name+'<h1>,We are so happy to join us </h1>'
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
};

// login user
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
        .then(user => {
            if(!user){
                const error = new Error('! A user with this email could not be found !');
                error.statusCode = 401;  //not authenticated
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if(!isEqual){
                const error = new Error('! Wrong password !');
                error.statusCode = 401;  //not authenticated
                throw error;
            }
            const token = jwt.sign(
                {email: loadedUser.email, userId: loadedUser._id.toString()},
                'secretsecretjsonwebtoken',
                { expiresIn: '12h'}
            );
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
};