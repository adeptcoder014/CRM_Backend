const model = require("../model/user");
const adminModel = require("../model/admin");
const zodiac = require("zodiac-signs")("en");
const axios = require("axios");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

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
      const user = await model.find({ status: req.body.filter });
      res.status(200).json({
        user,
      });
    } catch (err) {
      res.status(500).json({
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

      if (!userById) {
        return res.status(404).json({
          message: "Document not found !",
        });
      }

      res.status(200).json({
        // id: userById._id ? userById._id : userById.id,
        // id: userById?.id ,

        name: userById?.name,
        dob: userById?.dob,
        email: userById?.email,
        remark: userById?.remark,
        phone: userById?.phone,
        security: userById?.security,
        meterReading: userById?.meterReading,
        room: userById?.room,

        registeredDate: userById?.registeredDate,
        joiningDate: userById?.joiningDate,

        roomPreference: userById?.roomPreference,
        photo: userById?.photo,
        status: userById?.status,
        dues: userById?.dues,
        zodiac: zodiac.getSignByDate({
          day: userById?.dob.split("-")[2],
          month: userById?.dob.split("-")[1],
        }),
      });
    });

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
    const daysLeft =
      30 - dayjs(req.body.joiningDate).format("DD MM YYYY").split(" ")[0];
    const rentLeft = daysLeft * 150;
    const id = req.params.id;
    //--------------------
    // let rent =
    // console.log("month ------>", );
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
            year: dayjs(req.body.joiningDate)
              .format("DD MM YYYY")
              .split(" ")[2],
            month: dayjs(req.body.joiningDate)
              .format("DD MM YYYY")
              .split(" ")[1],
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
    // return

    const user = await model.findById(req.params.id);

    const rent = req.body.rent;
    const year = req.body.year;
    const month = req.body.month;
    const rentCycle = req.body.rentCycle;
    const reading = req.body.reading;
    const collectedBy = req.body.collectedBy;
    const transactionId = req.body.transactionId;

    // const initialReading = req.body.initialReading;

    //---------------
    // console.log("-->", );

    const lastMeterReading = user.dues.rents.at(-1).eBills.reading;
    const lastMonth = user.dues.rents.at(-1).month;
    const lastYear = user.dues.rents.at(-1).year;

    const meterCheck = reading - lastMeterReading;
    const readingLeft = reading - lastMeterReading;

    if (meterCheck === 0) {
      return res.status(500).json({
        message: "Meter reading entered is same as the previous one !!",
      });
    }
    if (lastMonth === req.body.month) {
      return res.status(500).json({
        message: "Already entered for this month !!",
      });
    }
    // if (lastMonth === req.body.month && lastYear === req.body.year  ) {
    //   return res.status(500).json({
    //     message: "Already entered for this month and the year, please search !!",
    //   });
    // }
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
      mode: {
        collectedBy: collectedBy,
        transactionId: transactionId,
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
      user?.dues?.rents?.filter((x) => {
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
          //-------------------------------------------------
          let totalForAdmin = Math.abs(
            Math.abs(x.due.total - newRent.due.rentDue) - newRent.due.ebillDue
          );
          let rentDueForAdmin = newRent.due.rentDue;
          let ebillDueForAdmin = newRent.due.ebillDue;
          let rentForAdmin = x.rent + newRent.due.rentDue;
          //-------------------------------------------------
          x.mode = newRent.mode;

          x.due.rentDue = x.due.rentDue - newRent.due.rentDue;
          x.rent = x.rent + newRent.due.rentDue;
          x.due.ebillDue = x.due.ebillDue - newRent.due.ebillDue;
          x.due.total = Math.abs(
            Math.abs(x.due.total - newRent.due.rentDue) - newRent.due.ebillDue
          );
          x.status = x.due.total === 0 ? "PAID" : "DUE";
          admin?.editedRents?.push({
            rentId: x.id,
            rentDue: rentDueForAdmin,
            ebillDue: ebillDueForAdmin,
            total: totalForAdmin,
            rent: rentForAdmin,
            mode: newRent.mode,
          });
        }
      });
    }

    if (isFirst) {
      user?.dues?.rents.filter(async (x) => {
        if (x.id === firstRentId) {
          //-------------------------------------------------
          let totalForAdmin = Math.abs(
            Math.abs(x.due.total - newRent.due.rentDue) - newRent.due.ebillDue
          );
          let rentDueForAdmin = x.due.rentDue - newRent.due.rentDue;
          let ebillDueForAdmin = x.due.ebillDue - newRent.due.ebillDue;
          let rentForAdmin = x.rent + newRent.due.rentDue;
          //-------------------------------------------------
          x.mode = newRent.mode;

          x.due.rentDue = x.due.rentDue - newRent.due.rentDue;
          x.rent = x.rent;
          x.due.ebillDue = x.due.ebillDue - newRent.due.ebillDue;
          x.due.total = Math.abs(
            Math.abs(x.due.total - newRent.due.rentDue) - newRent.due.ebillDue
          );
          x.status = x.due.total === 0 ? "PAID" : "DUE";
          admin.editedRents.push({
            rentId: x.id,
            rentDue: rentDueForAdmin,
            ebillDue: ebillDueForAdmin,
            total: totalForAdmin,
            rent: rentForAdmin,
            mode: newRent.mode,
          });
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
          rentDue: x.rentDue,
          ebillDue: x.ebillDue,
          rent: x.rent,
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

  //=================== LOGIN_USER ====================================
  loginUser: async (req, res) => {
    console.log("===============================================");
    // return
    const userData = await model.find({ phone: req.body.phone });
    const hai = userData[0].status;

    let check = false;
    if (userData && hai === "NEW") {
      check = true;
    }

    if (check) {
      return res.status(404).json("You are not yet apporoved by the admin");
    }
    try {
      if (!check) {
        const token =  jwt.sign({ id: userData[0]._id }, "0369");
  
        // return res.status(201).json({ token });
        return res.status(201).json(token);

      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  //=================== USER_PROFILE ====================================

  userProfile: async (req, res) => {
    console.log("-------", req.body);
    console.log("-------", req.file);
    res.status(201).json("hua ?");
    return;
    try {
      const userData = await model.findByIdAndUpdate(req.params.userId, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profilePhoto: req.body.photo,
      });

      res.status(201).json({
        userData,
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  //=================== USER_SEARCH ====================================

  userLogin: async (req, res) => {
    const userData = await model.find({ phone: req.body.phone });

    const hai = userData[0].status;
    console.log(userData[0].id);

    let check = false;
    if (userData && hai === "NEW") {
      check = true;
    }

    if (check) {
      return res.status(404).json("You are not yet apporoved by the admin");
    }
    try {
      if (!check) {
        const token =  jwt.sign({ id: userData[0].id }, "7860");
  
        // return res.status(201).json({ token });
        return res.status(201).json(token);

      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};
