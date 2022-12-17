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
  editedRents: [
    {
      rentId: {
        type: String,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const model = mongoose.model("admin", adminSchema);

module.exports = model;
