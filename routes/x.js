const express = require("express");
const router = express.Router();
const controller = require("../controller/x");
//================================
const x = async (req, res) => {
  // console.log("REQ----",req.body);

  res.send("Hello");
};
//===============================
router.post("/", controller.checkToken);
// router.post("/", controller.postRent);

module.exports = router;
