const model = require("../model/notice");
const axios = require("axios");
///==============================

module.exports = {
  //=================== GET ====================================

  getNotice: async (req, res) => {
    const data = await model.find({});
    res.status(200).send(data);
  },
  //=================== POST ====================================
  postNotice: async (req, res) => {
    console.log("--->", req.body);

    if (req.body.notice === "") {
        return res.status(405).json({message:"Do not leave the fields empty"});
    }

  
      const data = new model(req.body);
      await data.save();
      res.status(201).json("Notice has been created");
    
  },
  //=================== Delete ====================================
  deleteNotice: async (req, res) => {
    console.log("--->", req.params);


  
      await model.findByIdAndDelete(req.params.id)

      res.status(201).json("Notice deleted");
    
  },
};
