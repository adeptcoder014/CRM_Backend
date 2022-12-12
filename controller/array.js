const model = require("../model/array");
//============================

module.exports = {
  get: async (req, res) => {
    console.log(req.body);
    const data = await model.find({});
    res.status(200).json({
      data,
    });
  },
  //------------------------------

  post: async (req, res) => {
    console.log("---------->", req.body);
    // return
    const data = new model(req.body);
    await data.save();
    res.status(201).json({
      data,
    });
  },

  //-----------------------------

  postById: async (req, res) => {
    const data = await model.findById(req.params.id);
    console.log("yeh hai---->", req.body.friends);
    data.friends.push(req.body.friends);
    await data.save();
    res.status(200).json({
      data,
    });
  },
};
