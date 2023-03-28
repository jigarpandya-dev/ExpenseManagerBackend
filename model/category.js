const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
  user: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("categories", databaseSchema);
