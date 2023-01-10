const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./database");
const bodyParser = require("body-parser");
const register = require("./routes/register");
const user = require("./routes/user");
const rent = require("./routes/rent");
const adminLogin = require("./routes/adminLogin");
const admin = require("./routes/admin");
const session = require('express-session');

//====================================================

// Use the session middleware

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

  //====================================================
app.get("/", (req, res) => {
  res.send("<h1> CRM Server </h1>");
});
//===================================================
app.use("/register", register);
app.use("/user", user);
app.use("/rent", rent);
app.use("/rooms", require("./routes/rooms"))
app.use("/notice", require("./routes/notice"))
app.use("/account", require("./routes/account"))
app.use("/dashboard", require("./routes/dashboard"))
app.use("/admin", admin);
app.use("/admin/login", adminLogin);
app.use("/uploads", express.static("uploads"));
//===================================================
app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT : ${process.env.PORT}`);
});
