const express = require('express')
const router = express.Router()
const controller = require('../controller/rent')
//================================

router.get("/", controller.getRent);
router.get("/structure", controller.getRentStructure);
router.post("/", controller.postRent);
router.patch("/:id", controller.patchRent)

module.exports = router