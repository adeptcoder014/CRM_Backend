const mongoose = require("mongoose");
//================================

const rentSchema = new mongoose.Schema({
  doubble: {
    type: Number,
  },
  tripple: {
    type: Number,

  },
});

const model = mongoose.model("rent", rentSchema);

module.exports = model;
