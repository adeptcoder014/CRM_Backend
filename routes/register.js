const express = require("express");
const router = express.Router();
const controller = require("../controller/register");

router.post("/", controller.post)

module.exports = router;
