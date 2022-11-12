const mongoose = require("mongoose")
require('dotenv').config()
//===========================
mongoose.connect(process.env.DB_URl,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{console.log(`Database Connected !!`)})