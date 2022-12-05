const jwt = require("jsonwebtoken");
//=====================================
module.exports = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  // console.log(token)
  if (!token) return res.status(401).send("Access Denied");

  // try {
  const verified = jwt.verify(token, "0369");

  req.user = verified;
  // res.send(req.user)
  res.status(202).send({
    aayaKuch: req.user,
  });
  console.log("ho gaya authorize");

  next();
  // } catch (error) {
  //   res.status(400).send("Invalid token");
  // }
};
