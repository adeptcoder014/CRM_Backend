const mongoose = require("mongoose");
//================================

const dashboard = new mongoose.Schema({
  total: String,
});
const accountModel = mongoose.model("dashboard", dashboard);

module.exports = accountModel;
