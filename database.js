const mongoose = require("mongoose")
require('dotenv').config()
//===========================
DB_URL="mongodb+srv://User_369:TonyStark007@cluster0.37ajaix.mongodb.net/CRM?retryWrites=true&w=majority"

mongoose.connect(DB_URl,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{console.log(`Database Connected !!`)})