const express = require("express");
const router = express.Router();
const controller = require("../controller/account");
//==========================================
router.get("/", controller.getAccount);
router.post("/", controller.postAccountHeadsDebits);
router.get("/total", controller.getTotalCredit);
router.get("/sort/", controller.sortAccount);




module.exports = router;
