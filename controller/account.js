const model = require("../model/account");
//==================================================
module.exports = {
  //===============  GET_ALL ====================================
  getAccount: async (req, res) => {
    
    const data = await model.find({})
    res.status(200).json(data);
  },
  //===============  POST_ACCOUNTS_HEADS_DEBITS ====================================
  postAccountHeadsDebits: async (req, res) => {
    const { accountHead, credit, debit } = req.body;
    const data = new model({ accountHead, credit, debit });

    console.log("--------->", data);

    await data.save();
    res.status(201).json("New account head has been created");
  },
};
