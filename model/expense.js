const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
  date: {
    required: true,
    type: Date,
  },
  user: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
  },
  amount: {
    required: true,
    type: Number,
  },
  transactionType: {
    required: true,
    type: String,
  },
  notes: {
    required: false,
    type: String,
  },
});

module.exports = mongoose.model("expenses", databaseSchema);
