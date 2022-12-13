const model = require("../model/user");
const zodiac = require("zodiac-signs")("en");
const axios = require("axios");
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

    axios.get("http://localhost:5000/rent").then((ress) => {
      let perDayRent = ress.data.data[0].rentPerDay;
      // const days = 30 - userById.registeredDate.toString().split(" ")[2];
      //-----------------------------------
      res.json({
        name: userById.name,
        dob: userById.dob,
        email: userById.email,
        remark: userById.remark,
        phone: userById.phone,
        security: userById.security,
        meterReading: userById.meterReading,
        room: userById.room,

        registeredDate: userById.registeredDate,
        joiningDate: userById.joiningDate,

        roomPreference: userById.roomPreference,
        photo: userById.photo,
        status: userById.status,
        dues: userById.dues,
        zodiac: zodiac.getSignByDate({
          day: userById.dob.split("-")[2],
          month: userById.dob.split("-")[1],
        }),
      });
    });

    if (!userById) {
      return res.status(404).json({
        message: "Document not found !",
      });
    }

    // res.json({
    //   name: userById.name,
    //   dob: userById.dob,
    //   email: userById.email,
    //   remark: userById.remark,
    //   phone: userById.phone,
    //   registeredDate: userById.registeredDate,
    //   roomPreference: userById.roomPreference,
    //   photo: userById.photo,
    //   status: userById.status,
    //   room: userById.room,
    //   dues: 5555,

    //   zodiac: zodiac.getSignByDate({
    //     day: userById.dob.split("-")[2],
    //     month: userById.dob.split("-")[1],
    //   }),
    // });
  },
  //=================== PATCH ====================================
  patchUser: async (req, res) => {
    const id = req.params.id;
    const newBody = {
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      phone: req.body.phone,
      roomPreference: req.body.roomPreference,
      registeredDate: req.body.registeredDate,
      joiningDate: req.body.joiningDate,

      discount: req.body.discount,
      meterReading: req.body.meterReading,
      room: req.body.room,
      dues: req.body.dues,
      eBills: req.body.eBills,

      misc: req.body.misc,

      remark: req.body.remark,
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
  postRent: async (req, res) => {
    console.log(
      "---------------------------------------------------",
      req.body
    );
    const user = await model.findById(req.params.id);
    const month = req.body.month;
    const year = req.body.year;
    const rent = req.body.rent;

    const rentCycle = req.body.rentCycle;
    //------------------------------------------

    let newStatus = "";

    if (rent < rentCycle) {
      newStatus = "DUE";
    } else if (rent === rentCycle) {
      newStatus = "PAID";
    }else{
      newStatus = "in-house DUE";
    }
    //------------------------------------------

    const newBody = {
      rent: req.body.rent,
      year: req.body.year,
      month: req.body.month,
      rentCycle: req.body.rentCycle,
      status: newStatus,
    };
    //------------------------------------------
    let monthExists = false;

    {
      user.dues.rents.map((x) => {
        if (x.month === month && x.year === year) {
          monthExists = true;
        }
      });
    }
    if (monthExists) {
      return res
        .status(409)
        .json({ message: "Already entered for this month" });
    }
    //------------------------------------------
    user.dues.rents.push(newBody);
    await user.save();
    res.status(201).json(user);
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
