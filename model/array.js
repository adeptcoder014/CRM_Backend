const string = require("@hapi/joi/lib/types/string");
const mongoose = require("mongoose");
//================================

const array = new mongoose.Schema({
  type: String,
  rooms: [Number],
});
const model = mongoose.model("array", array);

module.exports = model;
