const bycrypt = require("bcrypt");
const joi = require("@hapi/joi");
const userModel = require("../model/user");
const multer = require("multer");

//========================================
const registerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.number().required(),
  // dob: joi.date().required(),
  // idPhoto: joi.binary().required(),
  // photo: joi.binary().required(),
  roomPreference: joi.string().required(),
});
//==================== Registering a user ===========================================
//-------------------------------------
module.exports = {
  post: async (req, res) => {
    console.log("Payload --->", req.file);
    // return
    try {
      const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        phone: req.body.phone,
        roomPreference: req.body.roomPreference,
      });
      if (req.file) {
        user.photo = req.file.path;
      }
      await user.save();
      res.status(201).json({
        status: "Done 😊",
        user,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

// const userModel = require("../model/user");

// module.exports = {
//   post: async (req, res) => {
//     try {
//       console.log("Payload ----", req.body);
//       const user = new userModel(req.body);
//       await user.save();
//       res.status(201).json({
//         status: "Done 😊",
//         user,
//       });
//     } catch (err) {
//       res.status(500).json({
//         status: "Didn't post 😔",
//         message: err.message,
//       });
//     }
//   },
//   patch: async (req, res) => {
//     try {
//       const data = await userModel.findByIdAndUpdate(req.params.id, req.body);

//       res.status(200).json({
//         status: "Updated 😊",
//         data,
//       });
//     } catch (err) {
//       res.status(500).json({
//         status: "Didn't updated 😔",
//         message: err.message,
//       });
//     }
//   },
//   delete: async (req, res) => {
//     try {
//       await userModel.findByIdAndDelete(req.params.id);

//       res.status(202).json({
//         status: "Deleted  😊",
//         data: {},
//       });
//     } catch (err) {
//       res.status(500).json({
//         status: "Didn't deleted  😔",
//         message: err.message,
//       });
//     }
//   },
// };
