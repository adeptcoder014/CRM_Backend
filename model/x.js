const mongoose = require("mongoose");
//================================

const x = new mongoose.Schema({
  doubble: {
    type: Number,
  },
  tripple: {
    type: Number,
  },
  rentPerDay: {
    type: Number,
  },
});

const model = mongoose.model("x", x);

module.exports = model;
