const express = require('express');
const app=express();

const mongoose = require('mongoose');


mongoose
  .connect('url')
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));