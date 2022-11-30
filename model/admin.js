const mongoose = require("mongoose");
//===================================
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 150,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const model = mongoose.model("admin", adminSchema);

module.exports = model;
