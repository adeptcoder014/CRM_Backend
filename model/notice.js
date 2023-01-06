const mongoose = require("mongoose");
//================================

const noticeModel = new mongoose.Schema({
  notice: String,
  type: String,
});
const model = mongoose.model("notice", noticeModel);

module.exports = model;
