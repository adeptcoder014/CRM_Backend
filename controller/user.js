const model = require("../model/user");
const zodiac = require("zodiac-signs")("en");

module.exports = {
  //===============  GET_ALL ====================================
  getUser: async (req, res) => {
    try {
      const user = await model.find();
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
  //===============  GET_FILTER_USER ====================================
  getFilteredUser: async (req, res) => {
    // console.log("---♋---> ", req.body);

    try {
      if (req.body.filter) {
        const user = await model.find({ status: req.body.filter });
        res.status(200).json({
          status: "Got ✅",
          user,
        });
      } else {
        const user = await model.find();
        res.status(200).json({
          status: "Got ✅",
          user,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "Nope ❌",
        err,
      });
    }
  },
  //===================== GetById =========================================
  getById: async (req, res) => {
    const userById = await model.findById(req.params.id);

    if (!userById) {
      return res.status(404).json({
        message: "Document not found !",
      });
    }

    res.json({
      name: userById.name,
      dob: userById.dob,
      email: userById.email,
      remark: userById.remark,
      phone: userById.phone,
      registeredDate: userById.registeredDate,
      roomPreference: userById.roomPreference,
      photo: userById.photo,
      status: userById.status,
      room: userById.room,
      
      zodiac: zodiac.getSignByDate({
        day: userById.dob.split("-")[2],
        month: userById.dob.split("-")[1],
      }),
    });
  },
  //=================== PATCH ====================================
  patchUser: async (req, res) => {
    console.log(
      "---------------------------------------------------",
      req.body
    );

    const id = req.params.id;
    const newBody = {
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      phone: req.body.phone,
      roomPreference: req.body.roomPreference,
      discount: req.body.discount,
      meterReading: req.body.meterReading,
      room: req.body.room,
      security: req.body.security,
      status: "REGISTERED",
    };
    try {
      const updatedUser = await model.findByIdAndUpdate(id, newBody);

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
    const deletedUser = await model.findByIdAndDelete(id);
    res.status(200).json({
      status: "Deleted 😊",
      deletedUser,
    });
  },
};
