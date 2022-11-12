const mongoose = require("mongoose")
const dotenv=require('dotenv').config()
//===========================
// const DB="mongodb+srv://User_369:TonyStark007@cluster0.37ajaix.mongodb.net/CRM?retryWrites=true&w=majority"
console.log("--->",process.env.DB_URL)
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{console.log(`Database Connected !!`)})