const model = require("../model/rent");
const axios = require("axios");
///==============================

module.exports = {
  //=================== GET ====================================

  getRent: async (req, res) => {
    try {
      const data = await model.find({});
      res.status(200).json({
        status: "Got ✅",
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: "Nope ❌",
        err,
      });
    }
  },
  //=================== POST ====================================
  postRent: async (req, res) => {
    try {
      const data = new model(req.body);
      await data.save();
      res.status(201).json({
        status: "Posted 😊",
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: "Didn't posted 😔",
        message: err.message,
      });
    }
  },
  //=================== PATCH ====================================
  patchRent: async (req, res) => {
    try {
      const data = await model.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).json({
        status: "Updated 😊",
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: "Didn't updated 😔",
        message: err.message,
      });
    }
  },
  //=================== GET_RENTAL_STRUCTURE ====================================
  getRentStructure: async (req, res) => {
    console.log("----->", req.query.date)

    axios.get("http://localhost:5000/rent").then((ress) => {
      let perDayRent = ress.data.data[0].rentPerDay;
      const days = 30 - req.query.date.split("-")[2];
      //-----------------------------------
      res.json({
        dues: perDayRent * days, // <------ sending it from the Backend
      });
    });
  },
};
