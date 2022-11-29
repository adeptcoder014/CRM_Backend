const express = require('express')
const router = express.Router()
// const controller = require('../controller/x')
//================================
const x = async(req,res)=>{
// console.log("REQ----",req.body);

res.send("Hello")
}
//===============================
router.get("/",require("../middlewares/x"), x);
// router.post("/", controller.postRent);

module.exports = router