const express = require("express");
const router = express.Router();
const controller = require("../controller/register");
const upload = require("../middlewares/upload");

router.post("/", upload.single("photo"), controller.post);

module.exports = router;
