const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
//======================================================
router.post("/", controller.getFilteredUser);
router.get("/list", require('../middlewares/authVerify'),controller.getUser);
router.get("/:id", controller.getById);
router.patch("/approval/:id", controller.patchUser);
router.delete("/:id", controller.deleteUser);
//---------------------------------------------------
module.exports = router;
