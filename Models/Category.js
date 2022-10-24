const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Type.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    items:[{
        type: Schema.Type.ObjectId,
        ref: 'Note',
        required: true
    }]
  }

});

module.exports = mongoose.model('Category', categorySchema);