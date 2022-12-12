const express = require("express");
const router = express.Router();
const controller = require("../controller/array");
//==========================
router.get("/", controller.get);
router.post("/", controller.post);
router.post("/:id", controller.postById);

//========================================
module.exports = router;
