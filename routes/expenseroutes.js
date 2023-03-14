const express = require("express");
const Expense = require("../model/expense");
const router = express.Router();
const { validateToken } = require("./authroutes");
const moment = require("moment");

module.exports = router;

//Add Expense
router.post("/addExpense", async (req, res) => {
  const data = new Expense({
    date: req.body.date,
    user: req.body.user,
    title: req.body.title,
    category: req.body.category,
    amount: req.body.amount,
    transactionType: req.body.transactionType,
    notes: req.body.notes,
  });

  try {
    const dataToSave = await data.save();
    res.send(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/updateExpense", async (req, res) => {
  try {
    const id = req.query.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Expense.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/deleteExpense", async (req, res) => {
  try {
    const id = req.query.id;
    const data = await Expense.findByIdAndDelete(id);
    res.send({ message: `Document with ${data.title} has been deleted..` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get All Expense
router.get("/getAllExpenses", validateToken, async (req, res) => {
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const lastdate = moment().endOf("month").format("YYYY-MM-DD");
  console.log(lastdate);

  try {
    const data = await Expense.find({
      $and: [
        { user: req.query.user },
        {
          date: {
            $gte: firstdate,
            $lte: lastdate,
          },
        },
      ],
    });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
