const express = require('express')
const router = express.Router()
const controller = require('../controller/notice')
//================================

router.get("/", controller.getNotice);
router.post("/", controller.postNotice);

module.exports = router