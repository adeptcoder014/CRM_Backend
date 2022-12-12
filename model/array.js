const string = require("@hapi/joi/lib/types/string");
const mongoose = require("mongoose");
//================================

const array = new mongoose.Schema({
  name: String,
  friends: [String],
});
const model = mongoose.model("array", array);

module.exports = model;
