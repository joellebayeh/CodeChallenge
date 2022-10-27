const express = require('express');
const route = express.Router();
const {body} = require('express-validator');
const categControler = require('../Controlers/categ');
const isAuth = require('../middleware/is-auth');
 

// GET /Categ/categories
route.get('/categories', isAuth, categControler.getCategs);

// POST /Categ/category
route.post(
    '/category', isAuth, 
    body('title').trim().isLength( {min: 3 , max : 20} ),
    categControler.createCateg
);

// GET /Categ/category/:categId
route.get('/category/:categId', isAuth, categControler.getCateg);

// PUT /Categ/category/:categId
route.put(
    '/category/:categId', isAuth, 
    body('title').trim().isLength({min: 3 , max : 20}),
    categControler.updateCateg
);

// DELETE /Categ/category/:categId
route.delete('/category/:categId', isAuth, categControler.deleteCateg);


module.exports = route;