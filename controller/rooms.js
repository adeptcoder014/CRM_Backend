const model = require("../model/user");
const axios = require("axios");
const _ = require('lodash');
///==============================

module.exports = {
  //=================== GET ====================================

  getRooms: async (req, res) => {
    const roomWithPartner = [];
    const partners = [];
    try {
      const data = await model.find({});

      data.filter((x) => {
        if (x.status === "REGISTERED" && x.room === 211) {
          //----------------------------
          partners.push(x.name);
          //   partners.push(x.name)

          roomWithPartner.push({
            name: partners,
            room: x.room,
          });


      
}});
const result = _.uniqBy(roomWithPartner,'room');

console.log("part --->",result)
      //   return;

      res.status(200).json( _.uniqBy(roomWithPartner,'room'));
    } catch (err) {
      res.status(500).json({
        status: "Nope ❌",
        err,
      });
    }
  },
};
