const userModel = require("../model/user");

module.exports = {
  //===============  GET ====================================
  get: async (req, res) => {
    try {
      const user = await userModel.find({});
      res.status(200).json({
        status: "Got ✅",
        user,
      });
    } catch (err) {
      res.status(500).json({
        status: "Nope ❌",
        err,
      });
    }
  },
  //===================== GetById =========================================
  getById: async (req, res) => {
    const userById = await userModel.findById(req.params.id);
    if (!userById) {
      return res.status(404).json({
        message: "Document not found !",
      });
    }
    res.json(userById.toJSON());
  },
  //=================== PATCH ====================================
  patchUser: async (req, res) => {
    console.log(" REQ -----------", req.body);
    console.log(" ID -----------", req.params.id);
    const id = req.params.id;
    const body = req.body;
    try {
      const updatedUser = await userModel.findByIdAndUpdate(id, body);

      res.status(200).json({
        status: "Updated 😊",
        updatedUser,
      });
    } catch (err) {
      res.status(500).json({
        status: "Didn't updated 😔",
        message: err.message,
      });
    }
  },
};
