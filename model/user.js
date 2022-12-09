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
  photo: {
    type: String,
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
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["NEW", "REGISTERED"],
    default: "NEW",
  },
  // dues: {
  //   type: new mongoose.Schema({
  //     rent: {
  //       type: String,
  //     },
  //     eBills: {
  //       type: String,
  //     },
  //     misc: {
  //       type: String,
  //     },
  //   }),
  // },
  dues: {
    type: Number,
  },
  eBills: {
    type: Number,
  },
  misc: {
    type: Number,
  },
});

const model = mongoose.model("user", userSchema);

module.exports = model;
