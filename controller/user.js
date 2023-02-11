const model = require("../model/user");
const adminModel = require("../model/admin");
const zodiac = require("zodiac-signs")("en");
const axios = require("axios");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const ADMIN_URL = require("../constant");

//=========================================
module.exports = {
  //===============  GET_NEW_USERS ====================================
  getNewUser: async (req, res) => {
    try {
      const user = await model.find({ status: "NEW" });
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
  //===============  GET_REGISTERD_USERS ====================================
  getRegisteredUser: async (req, res) => {
    try {
      const user = await model.find({ status: "REGISTERED" });
      // console.log("================================================",user)
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
  //===============  GET_Trippple_USERS ====================================
  getTrippleUser: async (req, res) => {
    try {
      const user = await model.find({
        status: "REGISTERED",
        roomPreference: "tripple",
      });
      // console.log("================================================",user)
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
  //===============  GET_Doubble_USERS ====================================
  getDoubleUser: async (req, res) => {
    try {
      const user = await model.find({
        status: "REGISTERED",
        roomPreference: "double",
      });
      // console.log("================================================",user)
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
        id: userById?.id,

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
        profilePhoto: userById?.profilePhoto,

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
    const adminId = req.header("Admin_User");
    const admin = await adminModel.findById(adminId);

    const rents = await axios.get(`${ADMIN_URL}/rent`);
    const rate = rents.data.data[0];
    const daysLeft =
      31 - dayjs(req.body.joiningDate).format("DD MM YYYY").split(" ")[0];

    const doubleRate = req.body.enteredRentCyle / 30;
    const trippleRate = req.body.enteredRentCyle / 30;

    const rentLeft =
      req.body.roomPreference === "double"
        ? daysLeft * doubleRate
        : daysLeft * trippleRate;
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
            rentCycle: req.body.enteredRentCyle,
            rent: rentLeft,
            status: "DUE",
            ebillGenerated: 0,
            eBills: {
              reading: req.body.meterReading,
              pricePerUnit: 7,
            },
            due: {
              rentDue: rentLeft,
              ebillDue: 0,
              total: rentLeft,
            },
            mode: {
              collectedBy: "",
              transactionId: "transactionId",
              cash: false,
              online: false,
            },
          },
        ],
      },
    };

    admin?.editedRents?.push({
      rentId: "xx-1",
      rentDue: rentLeft,
      ebillDue: 0,
      total: rentLeft,
      rent: rentLeft,
      // mode: newRent.mode,
      mode: {
        collectedBy: "",
        transactionId: "transactionId",
        cash: false,
        online: false,
      },
    });

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
    const adminId = req.header("Admin_User");

    const user = await model.findById(req.params.id);
    const admin = await adminModel.findById(adminId);

    // console.log("||------------------------>", req.body);

    // return;

    if (req.body.reading === 0) {
      return res.status(500).json({
        message: "Meter reading cannot be zero",
      });
    }

    const rent = req.body.rent;
    const year = req.body.year;
    const month = req.body.month;
    const rentCycle = req.body.rentCycle;
    const reading = req.body.reading;
    const collectedBy = req.body.collectedBy;
    const transactionId = req.body.transactionId;

    const last = user.dues.rents.slice(-1).pop();

    const lastMonth = last.month;
    const readingLeft = reading - last.eBills.reading;

    if (readingLeft === 0) {
      return res.status(500).json({
        message: "Meter reading entered is same as the previous one !!",
      });
    }
    if (lastMonth === req.body.month) {
      return res.status(500).json({
        message: "Already entered for this month !!",
      });
    }

    //---------------
    let newStatus = "";
    let dueRent = 0;
    let dueEbill = 0;

    //---------------
    dueEbill = readingLeft * 9;
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
      ebillGenerated: dueEbill,

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
        cash: false,
        online: false,
      },
    };

    admin?.editedRents?.push({
      rentId: "xx-1",
      rentDue: req.body.rent,
      ebillDue: 0,
      total: req.body.rent,
      rent: req.body.rent,
      // mode: newRent.mode,
      mode: {
        collectedBy: collectedBy,
        transactionId: transactionId,
        cash: false,
        online: false,
      },
    });

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
    await admin.save();

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

    console.log("=======================", req.body.data);
    console.log("======>>", req.body.mode);

    const newMode = {
      collectedBy:
        req.body.mode.collectedBy === "None" || req.body.mode === ""
          ? req.body.data.mode.collectedBy
          : req.body.mode.collectedBy,
      transactionId: req.body.data.mode.transactionId,
      cash: req.body.mode.cash,
      online: req.body.mode.online,
    };

    // return;
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
          // let rentForAdmin = x.rent + newRent.due.rentDue; // --> THE_CULPRIT 
          let rentForAdmin =newRent.due.rentDue;

          //-------------------------------------------------
          // x.mode = newRent.mode;
          x.mode = newMode;

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
            // mode: newRent.mode,
            mode: newMode,
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
          // x.mode = newRent.mode;
          x.mode = newMode;

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
            // mode: newRent.mode,
            mode: newMode,
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
        const token = jwt.sign({ id: userData[0]._id }, "0369");

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
    // console.log("-------", req.params.id);
    // console.log("-------", req.file);

    try {
      const userData = await model.findByIdAndUpdate(req.params.id, {
        profilePhoto: req.file.path,
      });

      // console.log("-------", userData);
      // return;

      res.status(201).json({
        userData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //=================== USER_SEARCH ====================================

  userLogin: async (req, res) => {
    const userData = await model.find({ phone: req.body.phone });

    console.log(userData);
    // return;
    if (userData === []) {
      return res.status(404).json("User not registered");
    }
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
        const token = jwt.sign({ id: userData[0].id }, "7860");

        // return res.status(201).json({ token });
        return res.status(201).json(token);
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  //===========================================
  getImageId: async (req, res) => {
    // var ID = path.join(__dirname, "../uploads/", req.query.file);

    // const filePath = `./uploads/${req.query.file}`;

    // const readStream = fs.createReadStream(filePath);
    // // console.log(readStream);
    // readStream.pipe(res);

    // const fileName = req.params.fileName;
    // return
    try {
      const filePath = path.join(__dirname, "../uploads", req.body.imageUrl);
      console.log("----------->", filePath);

      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json(error);
    }
    // res.sendFile(readStream);

    // const ID = req.body.image;
    // res.sendFile(ID, { root: './' })

    // res.sendFile(file);
    //  const file = path.join( __dirname,`../uploads/${file.split("uploads\\")[1]}`)
  },
};
