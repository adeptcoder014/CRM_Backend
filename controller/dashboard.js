const model = require("../model/user");
//==================================================
module.exports = {
  //===============  GET_ALL ====================================
  getDashboard: async (req, res) => {
    const data = await model.find({});

    const tripple = await model.find({
      status: "REGISTERED",
      roomPreference: "tripple",
    });
    const double = await model.find({
      status: "REGISTERED",
      roomPreference: "double",
    });

    const newly = data.filter((x) => {
      if (x.status === "NEW") {
        return x;
      }
    });

    const registered = data.filter((x) => {
      if (x.status === "REGISTERED") {
        return x;
      }
    });

    res.status(200).json({
      total: registered.length,
      new: newly.length,
      double: double.length,

      tripple: tripple.length,
    });
  },
};
