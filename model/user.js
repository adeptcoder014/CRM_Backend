const mongoose = require("mongoose");
//===================================
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    max: 150,
  },
  email: {
    type: String,
    // required: true,
  },
  dob: {
    type: String,
    // required: true,
  },
  phone: {
    type: Number,
    // required: true,
    // min: 10,
    // max: 10,
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
    // required: true,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
