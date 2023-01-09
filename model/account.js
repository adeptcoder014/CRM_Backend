const mongoose = require("mongoose");
//================================

const accountDebitHeads = new mongoose.Schema({
  accountHead: String,
  time: {
    type: Date,
    default: Date.now,
  },
  credit: Number,
  debit: Number,
});
const model = mongoose.model("accountDebitHeads", accountDebitHeads);

module.exports = model;
