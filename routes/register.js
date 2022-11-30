const express = require("express");
const router = express.Router();
const controller = require("../controller/userRegister");
const upload = require("../middlewares/upload");

router.post("/", upload.single("photo"), controller.post);

module.exports = router;
