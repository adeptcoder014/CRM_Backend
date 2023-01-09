const express = require('express')
const router = express.Router()
const controller = require('../controller/notice')
//================================

router.get("/", controller.getNotice);
router.post("/", controller.postNotice);
router.delete("/:id", controller.deleteNotice);


module.exports = router