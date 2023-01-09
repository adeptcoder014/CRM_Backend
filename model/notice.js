const mongoose = require("mongoose");
//================================

const noticeModel = new mongoose.Schema({
  notice: String,
  type: String,
  time:{
    type: Date,
    default: Date.now,
  }
});
const model = mongoose.model("notice", noticeModel);

module.exports = model;
