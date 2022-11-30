const express = require("express");
const router = express.Router();
const controller = require("../controller/adminLogin");
//========================================================

router.post("/", controller.adminLogin);
router.get("/", controller.getAdmin);

module.exports = router;
