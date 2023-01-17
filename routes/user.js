const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const upload = require("../middlewares/upload");

//======================================================
router.post("/", controller.getFilteredUser);
router.get("/list",controller.getUser);
router.get("/:id", controller.getById);
router.get("/get-rents/:id", controller.getRentsOfUser);

router.patch("/approval/:id", controller.patchUser);
router.post("/rent/:id", controller.postRent);
router.post("/get-rent/:id", controller.getRentById);
router.patch("/rent/:id", controller.patchRentById);
router.get("/edited-by/:id", controller.getEditedBy);

router.delete("/:id", controller.deleteUser);
router.post("/login", controller.loginUser);
router.post("/profile", controller.userProfile);


//---------------------------------------------------
module.exports = router;
    