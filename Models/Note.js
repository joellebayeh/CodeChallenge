const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Type.ObjectId,
    ref: 'User',
    required: true
  },
  category:{
    type: Schema.Type.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: {
    items:[{
        type: string,
        required: true
    }]
  }

});

module.exports = mongoose.model('Note', noteSchema);