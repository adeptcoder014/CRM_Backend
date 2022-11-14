const bycrypt = require("bcrypt");
const joi = require("@hapi/joi");
const userModel = require("../model/user");
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
module.exports = {
  post: async (req, res) => {
    try {
      const emailExists = await userModel.findOne({
        email: req.body.email,
      });
      if (emailExists) {
        res.status(400).send("Email alreadt exists");
        return;
      }
      const user = new userModel(req.body);
      const userData = await user.save();
      res.status(201).json({
        status: "Post ✅",
        userData,
      });
    } catch (err) {
      
        res.status(400).send(err);
      
    }
  },
};
