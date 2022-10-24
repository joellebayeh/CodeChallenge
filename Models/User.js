const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  categories: {
    items:[{
        type: Schema.Type.ObjectId,
        ref: 'Category',
        required: true
    }]
  }

});

module.exports = mongoose.model('User', userSchema);
