const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['nebaigta', 'baigta'], default: 'nebaigta' },
});

module.exports = mongoose.model('Todo', todoSchema);
