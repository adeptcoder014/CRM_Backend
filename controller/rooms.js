const model = require("../model/user");
const axios = require("axios");
const _ = require("lodash");
const dayjs = require("dayjs");
///==============================
function diff(A) {
  return A.slice(1).map(function (n, i) {
    return n - A[i];
  });
}

function extractProperties(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    var newObj = {};
    for (var prop in obj) {
      newObj[prop] = obj[prop];
    }
    newArr.push(newObj);
  }
  return newArr;
}



module.exports = {
  //=================== GET ====================================

  getRooms: async (req, res) => {
    const roomWithPartner = [];
    const partners = [];
    let reading = [];
    let jDate = [];

    const data = await model.find({ room: req.query.room });
    data.map((x) => (reading.push(x.meterReading), jDate.push(x.joiningDate)));
   


    const last =[]
    
    data.map((x) => {
      last.push(x.dues.rents.slice(-1).pop());
    });
    
    let nextReading =[]
    
    last.map((x) => {
      nextReading.push(x.eBills.reading);
    });

    const days = jDate.map((x) => dayjs(x).format("DD MM YYYY").split(" ")[0]);
    const months = jDate.map(
      (x) => dayjs(x).format("DD MM YYYY").split(" ")[1]
    );

    let readingA = reading[0];// A's reading
    let readingB = reading[1];// B's reading

    let diff = readingB - readingA;    // A's rent
    let d = nextReading[0] - readingB ; // A+B's rents

    // console.log("A reading",  diff)
    // console.log("A+B reading",  d)

    // console.log("A rents",  diff*7)
    // console.log("A+B rents",  d*7)
    console.log("===================================")

    // var extractedProperties = extractProperties(data[0].dues.rents);
    // console.log(extractedProperties)
    // console.log("------->", reading);
    // console.log("------->", diff(reading));
    // console.log("------->", days);
    // console.log("------->", months);

    // console.log("------->", object);

    return;

    data.filter((x) => {
      if (x.status === "REGISTERED" && x.room === 211) {
        //----------------------------rs
        partners.push(x.name);
        //   partners.push(x.name)

        roomWithPartner.push({
          name: partners,
          room: x.room,
        });
      }
    });
    const result = _.uniqBy(roomWithPartner, "room");

    //   return;

    res.status(200).json(_.uniqBy(roomWithPartner, "room"));
  },
};
