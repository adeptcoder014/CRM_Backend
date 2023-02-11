const dayjs = require("dayjs");
const accountModel = require("../model/account");
const model = require("../model/user");
//==================================================
module.exports = {
  //===============  GET_ALL ====================================
  getAccount: async (req, res) => {
    const data = await accountModel.find({});
    res.status(200).json(data);
  },
  //===============  POST_ACCOUNTS_HEADS_DEBITS ====================================
  postAccountHeadsDebits: async (req, res) => {
    const { accountHead, credit, debit } = req.body;
    const data = new accountModel({ accountHead, credit, debit });

    await data.save();
    res.status(201).json("New account head has been created");
  },
  //===================== TOTAL_ACCOUNT_CREDIT =========================================
  getTotalCredit: async (req, res) => {
    const usersData = await model.find({});
    //--------------------------------------

    const debits = await accountModel.find({});
    let totalDebit = 0;
    debits.map((x) => {
      totalDebit += x.debit;
    });

    //-----------------------------------
    let totalRent = 0;
    let length = 0;
    let due = 0;
    let totalCredit = 0;
    let ebill = 0;

    usersData.map((x) => {
      length = x.dues.rents.length;
      x.dues.rents.map((w) => {
        totalRent = totalRent + w.rent;
        ebill = ebill + w.ebillGenerated ;
        totalCredit = totalRent - due;
      });
    });
    //-----------------------------

    res.status(200).json({
      ebill,
      totalRent,
      length,
      due,
      totalCredit,
      totalDebit,
    });
  },
  //===================== SORTING_ACCOUNT =========================================
  sortAccount: async (req, res) => {
    const date = req.query.date;
    let check = false;
    const usersData = await accountModel.find({});
    let sortedData = usersData.filter((x) => {
      const formattedDate = dayjs(x.time).format("YYYY-MM-DD");

      if (formattedDate === date) {
        console.log("YES -------------------------------------");
        return x;
      }
    });

    res.status(200).json(sortedData);
  },
};
