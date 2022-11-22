const userModel = require("../model/user");
const zodiac = require("zodiac-signs")("en");

module.exports = {
  //===============  GET ====================================
  post: async (req, res) => {
    console.log("---♋---> ", req.body);

    try {
      const user = await userModel.find({ status: req.body.filter });
      // console.log("DOB", user.dob)
      // console.log('♋ ',zodiac.getSignByDate({ day: 22, month: 6 }));
      console.log("---♋---> ", user);

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

    res.json({
      userById,
      zodiac: zodiac.getSignByDate({
        day: userById.dob.split("-")[2],
        month: userById.dob.split("-")[1],
      }),
    });
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
  //=================== DELETE ====================================
  deleteUser: async (req, res) => {
    const id = req.params.id;
    const deletedUser = await userModel.findByIdAndDelete(id);
    res.status(200).json({
      status: "Deleted 😊",
      deletedUser,
    });
  },
};
