const bycrypt = require("bcrypt");
const joi = require("@hapi/joi");
const model = require("../model/user");
const multer = require("multer");
const AWS = require("aws-sdk");
require("dotenv").config();
const fs = require("fs");

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
    const emailExists = await model.findOne({
      email: req.body.email,
    });

    if (emailExists?.email === req.body.email) {
      res.status(406).send("Email already registered");
      return;
    }

    //========= AWS ====================
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();
    const s3Params = {
      Bucket: "general-369",
      Key: `/${req.file.filename}`,
      Body: fs.createReadStream(req.file.path),
      ACL: "public-read",
      ContentType: req.file.mimetype,
    };

    const uploadPromise = s3.upload(s3Params).promise();
    let link = await uploadPromise;

    try {
      const user = new model({
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        phone: req.body.phone,
        security: req.body.roomPreference === "double" ? 12000 : 10000,

        roomPreference: req.body.roomPreference,

        photo: link.Location,
        status: "NEW",
      });
      // console.log("xxxxxxxxxxxx--->", a.Location);
      // return;

      const { error } = await registerSchema.validateAsync(req.body);
      if (error) {
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
