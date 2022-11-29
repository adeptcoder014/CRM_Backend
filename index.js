const express = require('express');
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./database')
const bodyParser = require("body-parser")
const register = require("./routes/register")
const user = require("./routes/user")
const rent = require("./routes/rent")
//====================================================
app.use(
    cors({
      origin: '*',
    })
  );
  app.use(express.json());
  app.use(
    express.urlencoded({  
      extended: true,
    })
  );
  
//====================================================
app.get('/', (req,res)=>{
    res.send("<h1> CRM Server </h1>")
})
//===================================================
app.use("/register", register)
app.use("/user", user)
app.use("/rent", rent)
app.use("/x", require("./routes/x"))
app.use('/uploads',express.static('uploads'))
//===================================================
app.listen(process.env.PORT, ()=>{
    console.log(`Server started on PORT : ${process.env.PORT}`)
})