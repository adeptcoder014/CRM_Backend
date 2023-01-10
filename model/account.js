const mongoose = require("mongoose");
//================================

const accountDebitHeads = new mongoose.Schema({
  accountHead: String,
  time: {
    type: Date,
    default: Date.now,
  },
  debit: Number,
});
const accountModel = mongoose.model("accountDebitHeads", accountDebitHeads);

module.exports = accountModel;
