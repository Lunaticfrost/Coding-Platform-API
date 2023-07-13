const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortBody: String,
  lastModified: {
    body: Number,
    settings: Number,
  },
  permissions: {
    edit: Boolean,
    clone: Boolean,
  },
  uri: {
    type: String,
    required: true,
  },
  testcases: [{
    number: Number,
    active: String,
  }],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
