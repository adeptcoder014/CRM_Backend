const model = require("../model/user");
const adminModel = require("../model/admin");
const zodiac = require("zodiac-signs")("en");
const axios = require("axios");
const dayjs = require("dayjs");
//=========================================
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
        id: userById.id ? userById.id : userById._id,

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
    // console.log("------>",)

    const daysLeft =
      30 - dayjs(req.body.joiningDate).format("DD MM YYYY").split(" ")[0];
    const rentLeft = daysLeft * 150;
    const id = req.params.id;
    //--------------------
    // let rent =
    //-------------------
    const newBody = {
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      phone: req.body.phone,
      roomPreference: req.body.roomPreference,
      registeredDate: req.body.registeredDate,
      joiningDate: req.body.joiningDate,

      meterReading: req.body.meterReading,
      room: req.body.room,

      remark: req.body.remark,
      security: req.body.security,
      status: "REGISTERED",
      dues: {
        rents: [
          {
            year: 2022,
            month: "December",
            rentCycle: req.body.security,
            rent: rentLeft,
            status: "DUE",
            eBills: {
              reading: req.body.meterReading,
              pricePerUnit: 7,
            },
            due: {
              rentDue: rentLeft,
              ebillDue: 0,
              total: rentLeft,
            },
          },
        ],
      },
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
  //=================== POST_RENT ====================================
  postRent: async (req, res) => {
    // console.log("------------------>", req.body);

    const user = await model.findById(req.params.id);

    const rent = req.body.rent;
    const year = req.body.year;
    const month = req.body.month;
    const rentCycle = req.body.rentCycle;
    const reading = req.body.reading;
    // const initialReading = req.body.initialReading;

    //---------------
    // console.log("-->", );

    const lastMeterReading = user.dues.rents.at(-1).eBills.reading;

    const check = reading - lastMeterReading;
    const readingLeft = reading - lastMeterReading;

    if (check === 0) {
      return res.status(500).json({
        message: "Chudaoo ebill check kar , ek he reading rakhega ?!",
      });
    }
    // return;

    //---------------
    let newStatus = "";
    let dueRent = 0;
    let dueEbill = 0;

    //---------------
    dueEbill = readingLeft * 7;
    dueRent = rentCycle - rent;
    if (!rentCycle - rent && dueEbill !== 0) {
      newStatus = "DUE";
    } else if (rentCycle - rent && dueEbill === 0) {
      newStatus = "PAID";
    } else if (dueEbill !== 0) {
      newStatus = "DUE";
    }
    //------------------------------------------

    const newBody = {
      rent: req.body.rent,
      year: req.body.year,
      month: req.body.month,
      rentCycle: req.body.rentCycle,
      status: newStatus,
      eBills: {
        reading: reading,
        pricePerUnit: 7,
      },
      due: {
        rentDue: dueRent,
        ebillDue: dueEbill,
        total: dueRent + dueEbill,
      },
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
  //=================== GET_RENT_BY_ID ====================================

  getRentsOfUser: async (req, res) => {
    // console.log();

    const user = await model.findById(req.params.id);

    res.status(200).json(user.dues.rents);
  },

  //=================== GET_RENT_BY_ID ====================================
  getRentById: async (req, res) => {
    const userId = req.body.userId;
    const rentId = req.params.id;
    const user = await model.findById(userId);

    {
      user.dues.rents.filter((x) => {
        if (x.id === rentId) {
          return res.status(200).json({ rent: x });
        }
      });
    }
  },

  //=================== PATCH_RENT_BY_ID ====================================

  patchRentById: async (req, res) => {
    const rentId = req.params.id;
    const newRent = req.body.data;

    //------------ GETTING_USER --------------------
    const userId = req.body.userId;
    const user = await model.findById(userId);
    const adminId = req.header("Admin_User");
    const admin = await adminModel.findById(adminId);
    //------------------------------------------

    // console.log("----------------------->", );
    const firstRentId = user?.dues?.rents[0].id;
    // return;

    let isFirst = false;

    {
      user?.dues?.rents.filter(async (x) => {
        if (rentId === x.id && rentId === firstRentId) {
          return (isFirst = true);
        } else if (x.id === rentId && rentId !== firstRentId) {
          x.due.rentDue = x.due.rentDue - newRent.due.rentDue;
          x.rent = x.rent + newRent.due.rentDue;
          x.due.ebillDue = x.due.ebillDue - newRent.due.ebillDue;
          x.due.total = Math.abs(
            Math.abs(x.due.total - newRent.due.rentDue) - newRent.due.ebillDue
          );
          x.status = x.due.total === 0 ? "PAID" : "DUE";
          admin.editedRents.push({
            rentId: x.id,
            rentDue: x.due.rentDue,
            ebillDue: x.due.ebillDue,
            rent: x.rent,
          });
        }
      });
    }

    if (isFirst) {
      user?.dues?.rents.filter(async (x) => {
        if (x.id === firstRentId) {
          x.due.rentDue = x.due.rentDue - newRent.due.rentDue;
          x.rent = x.rent;
          x.due.ebillDue = x.due.ebillDue - newRent.due.ebillDue;
          x.due.total = Math.abs(
            Math.abs(x.due.total - newRent.due.rentDue) - newRent.due.ebillDue
          );
          x.status = x.due.total === 0 ? "PAID" : "DUE";
          admin.editedRents.push(x);
        }
      });
      // return res.status(500).json("ho gayi chod");
    }
    try {
      await admin.save();
      await user.save();
      res.status(201).json("Ho gaya");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //=================== WHO_EDITED_GET_BY_RENTID ====================================

  getEditedBy: async (req, res) => {
    const rentId = req.params.id;
    const adminId = req.header("Admin_User");
    const admin = await adminModel.findById(adminId);
    // console.log("--------------->", );
    const editedRents = [];
    admin.editedRents.filter((x) => {
      if (x.rentId === rentId) {
        editedRents.push({
          when: x.time,
          who: admin.name,
          rentDue:x.rentDue,
          ebillDue:x.ebillDue,
          rent:x.rent
        });
      }
    });
    res.status(200).json(editedRents);
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
