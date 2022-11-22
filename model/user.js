const mongoose = require("mongoose");
//===================================
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 150,
  },
  email: {
    type: String,
  },
  dob: {
    type: String,
  },
  phone: {
    type: Number,
  },
  // idPhoto: {
  //   data: Buffer,
  //   contentType: String,
  //   // required: true,

  // },
  photo: {
    data: Buffer,
    contentType: String,
  },
  roomPreference: {
    type: String,
  },
  room: {
    type: Number,
  },
  meterReading: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  security: {
    type: Number,
  },
  remark: {
    type: String,
  },
  zodiac: {},
  registeredDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["NEW", "REGISTERED"],
    default: "NEW",
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
