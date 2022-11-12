const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./database')
//====================================================
app.use(cors())
app.use(express.json())
//====================================================

app.get('/', (req,res)=>{
    res.send("<h1> CRM Server </h1>")
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server started on PORT : ${process.env.PORT}`)
})