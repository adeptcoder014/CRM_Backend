const userModel = require("../model/user");

module.exports = {
  get: async (req, res) => {
    try {
      const user = await userModel.find({});
      // console.log("Users :---",user)
      res.status(200).json({
        status: "Got ✅",
        user,
      });
    } catch (err) {
      res.status(500).json({    
        status: "Nope ❌",
        err,
      });
    }
  },
};
