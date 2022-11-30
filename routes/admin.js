const express = require("express");
const router = express.Router();
const controller = require("../controller/admin");
//==========================================
router.get("/list", controller.getAdmin);
router.post("/", controller.postAdmin);

// router.get("/:id", controller.getById);
// router.patch("/approval/:id", controller.patchUser);
// router.delete("/:id", controller.deleteUser);

module.exports = router;
