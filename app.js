const express = require('express');
const app=express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const noteRoute = require('./Routes/note');
const categRoute = require('./Routes/categ');
const authRoute = require('./Routes/auth'); 


// body-parser for json data
app.use(bodyParser.json());

// for CORS error
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
});

// Routes
app.use('/Note', noteRoute);
app.use('/Categ', categRoute);
app.use('/auth',authRoute);

// for Handling errors
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// connect to data base
const url='atlasUrl'
mongoose
  .connect(url)
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
 
