const model = require("../model/notice");
const axios = require("axios");
///==============================

module.exports = {
  //=================== GET ====================================

  getNotice: async (req, res) => {

    const data = await model.find({})
    res.status(200).send(data);
  },
  //=================== POST ====================================
  postNotice: async (req, res) => {
    console.log("--->", req.body);

    try {
      const data = new model(req.body);
      await data.save();
      res.status(201).json("Notice has been created");
    } catch (error) {
      res.status(500).json("Didn't posted 😔");
    }
  },
  //=================== PATCH ====================================
};
