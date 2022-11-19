const express = require("express");
const router = express.Router();
const controller = require("../controller/user");

router.get("/", controller.get)
router.get("/:id", controller.getById)
router.patch("/approval/:id", controller.patchUser)
module.exports = router;
