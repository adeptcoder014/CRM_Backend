const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const uploadProfileImage = require("../middlewares/uploadProfileImage");

//======================================================
router.post("/", controller.getFilteredUser);
router.get("/registered",controller.getRegisteredUser);
router.get("/new",controller.getNewUser);
router.get("/tripple",controller.getTrippleUser);
router.get("/double",controller.getDoubleUser);

router.get("/list",controller.getUser);
router.get("/:id", controller.getById);
router.get("/get-rents/:id", controller.getRentsOfUser);

router.patch("/approval/:id", controller.patchUser);
router.post("/rent/:id", controller.postRent);
router.post("/get-rent/:id", controller.getRentById);
router.patch("/rent/:id", controller.patchRentById);
router.get("/edited-by/:id", controller.getEditedBy);

router.delete("/:id", controller.deleteUser);
router.post("/login", controller.userLogin);
router.post("/profile/:id",uploadProfileImage.single("profilePhoto"), controller.userProfile);

router.post("/get-imageId", controller.getImageId);

// router.get("/search", controller.searchUser);



//---------------------------------------------------
module.exports = router;
    