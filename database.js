const mongoose = require("mongoose");
require("dotenv").config();
//===========================
const DB = "mongodb+srv://Ahmed:waqar123@cluster0.te8fb8e.mongodb.net/CRM?retryWrites=true&w=majority"
// const DB =
//   "mongodb+srv://User_369:TonyStark007@cluster0.37ajaix.mongodb.net/CRM?retryWrites=true&w=majority";

// console.log("---<>",process.env.DB_URL)
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Database Connected `);
  });
