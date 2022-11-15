const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./database')
const bodyParser = require("body-parser")
const register = require("./routes/register")
const user = require("./routes/user")
//====================================================
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(express.json())
//====================================================

app.get('/', (req,res)=>{
    res.send("<h1> CRM Server </h1>")
})

app.use("/register", register)
app.use("/user", user)

app.listen(process.env.PORT, ()=>{
    console.log(`Server started on PORT : ${process.env.PORT}`)
})