const model = require("../model/user");
//=====================================
module.exports = async (req, res, next) => {
  
    const user = await model.findById(req.params.id);
    const month = req.body.month;
    
    user.dues.rents.map((x) => {
      if (x.month === month) {
        res.status(409).json({ message: "Already entered for this month" });
        return;
      }
    });

  next();

};
