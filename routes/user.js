const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
//======================================================
router.post("/", controller.getFilteredUser);
router.get("/list",controller.getUser);
router.get("/:id", controller.getById);
router.get("/get-rents/:id", controller.getRentsOfUser);

router.patch("/approval/:id", controller.patchUser);
router.post("/rent/:id", controller.postRent);
router.post("/get-rent/:id", controller.getRentById);
router.patch("/rent/:id", controller.patchRentById);
router.post("/ebill/:id", controller.postEbill);

router.delete("/:id", controller.deleteUser);
//---------------------------------------------------
module.exports = router;
