const model = require("../model/user");
//==================================================
module.exports = {
  //===============  GET_ALL ====================================
  getDashboard: async (req, res) => {
    const data = await model.find({});
    const length = data.filter((x) => {
      if (x.status === "NEW") {
        return x;
      }
    });

    const double = data.filter(x=>{
        if(x.roomPreference ==='double'){
            return x
        }
    })
    const tripple = data.filter(x=>{
        if(x.roomPreference ==='tripple'){
            return x
        }
    })

    res.status(200).json({
      total: data.length,
      new: length.length,
      double: double.length,

      tripple: tripple.length,

    });
  },
};
