const express = require("express");
const Category = require("../model/category");
const router = express.Router();

module.exports = router;

router.post("/addCategory", async (req, res) => {
  if (!req.body.category)
    return res.status(400).json({ message: "Category is invalid." });

  try {
    const userCategory = await Category.findOne({
      user: req.body.user,
      category: req.body.category,
    });
    //check to see if the user exists in the list of registered users
    if (userCategory != null)
      return res.status(400).json({ message: "Category already exist." });

    const data = new Category({
      user: req.body.user,
      category: req.body.category,
    });

    const dataToSave = await data.save();
    return res.send({
      message: `Your category ${dataToSave.category} has beed added.`,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//Get All Categories
router.get("/getCategories", async (req, res) => {
  try {
    const data = await Category.find({ user: req.query.user });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
