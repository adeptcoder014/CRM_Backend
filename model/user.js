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
  profilePhoto: {
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
  enteredRentCyle: {
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
  dues: {
    rents: [
      {
        type: new mongoose.Schema({

          year: Number,
          month: String,
          status: String,
          rent: Number,
          rentCycle: Number,
          ebillGenerated: Number,


          mode: {
            collectedBy: String,
            transactionId: String,
            cash: Boolean,
            online: Boolean,
          },
          eBills: {
            reading: Number,
            pricePerUnit: Number,
          },
          due: {
            rentDue: Number,
            ebillDue: Number,
            total: Number,
          },
        }),
      },
    ],
  },
  misc: {
    type: Number,
  },
});

const model = mongoose.model("user", userSchema);

module.exports = model;
