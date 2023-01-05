const express = require('express')
const router = express.Router()
const controller = require('../controller/rooms')
//================================

router.get("/", controller.getRooms);


module.exports = router