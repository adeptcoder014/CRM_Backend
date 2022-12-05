const bycrypt = require("bcrypt");
const joi = require("@hapi/joi");
const model = require("../model/user");
const multer = require("multer");

//========================================
const registerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.number().required(),
  dob: joi.date().required(),
  // photo: joi.string().required(),
  roomPreference: joi.string().required(),
});
//==================== POST ===========================================
module.exports = {
  post: async (req, res) => {
    // console.log("Payload --->", req.file);
    const emailExists = await model.findOne({
      email: req.body.email,
    });

    if (emailExists?.email === req.body.email) {
      res.status(406).send("Email already registered");
      return;
    }
    // console.log("<<-==================>", req.file)
    try {
      const user = new model({
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        phone: req.body.phone,
        roomPreference: req.body.roomPreference,
        // photo:{
        //   data:req.file.filename,
        //   contentType:req.file.mimetype
        // },
        photo: req.file.path,
        status: "NEW",
      });
      // if (req.file) {
      //   photo = req.file.path;
      //   // console.log("<<------->>",req.file);
      // }
      const { error } = await registerSchema.validateAsync(req.body);
      if (error) {
        // res.status(400).send(error.details[0].message);
        res.status(400).send(":: Error Hai ::", error);

        return;
      }
      if (req.body.phone.length < 10 || req.body.phone.length > 10) {
        res.status(400).send("Invalid Phone number");

        return;
      } else {
        await user.save();
        res.status(201).json({
          status: "Done 😊",
          user,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
