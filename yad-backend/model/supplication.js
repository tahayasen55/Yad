const mongoose = require('mongoose');

// Define the schema for Supplications
const supplicationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    kurdish: {
      type: String,
      required: false,
    },
    arabic: {
      type: String,
      required: false,
    },
    english: {
      type: String,
      required: false,
    },
  },
});

const Supplication = mongoose.model('Supplication', supplicationSchema);

module.exports = Supplication;
