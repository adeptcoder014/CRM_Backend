const model = require("../model/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//=======================================================
module.exports = {
  //=================== GET ====================================

  getAdmin: async (req, res) => {
    try {
      const data = await model.find({});
      res.status(200).json({
        status: "Got ✅",
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: "Nope ❌",
        err,
      });
    }
  },
  //=================== POST ====================================
  adminLogin: async (req, res) => {
    try {
      const user = await model.findOne({ email: req.body.email });
      // console.log("Client user --->", req.body);
      // console.log("Server user --->", user);

      if (!user) {
        return res.status(400).send("Incorrect email");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(400).send("Incorrect Password");
      } else {
        const token = jwt.sign({ _id: user.id }, "0369");
        res.header("auth-token", token).json({
          token: token,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "Didn't posted 😔",
        message: err.message,
      });
    }
  },
  //=================== PATCH ====================================
  // patchRent: async (req, res) => {
  //   try {
  //     const data = await model.findByIdAndUpdate(req.params.id, req.body);

  //     res.status(200).json({
  //       status: "Up dated 😊",
  //       data,
  //     });
  //   } catch (err) {
  //     res.status(500).json({
  //       status: "Didn't updated 😔",
  //       message: err.message,
  //     });
  //   }
  // },
};
