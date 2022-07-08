const express = require("express");
const router = express.Router();
const { blogsDB } = require("../mongo");

router.get("/hello-blogs", (req, res) => {
  res.json({ message: "hello from express" });
});

// if stamements --- sort field is equal to "ASC", then sequential (1) and the opposite (-1).
router.get("/all-blogs", async (req, res) => {
  const limit = Number(req.query.limit);
  const skip = Number(req.query.limit) * (Number(req.query.page) - 1);
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
  const filterField = req.query.filterField;
  const filterValue = req.query.filterValue;

  try {
    const collection = await blogsDB().collection("blogs50");
    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      sortObj = { [sortField]: sortOrder };
    }

    // const posts = await collection.find({}).toArray();
    const posts = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    res.json({ message: posts });
  } catch (error) {
    res.status(500).send("error fetching posts " + error);
  }
});

module.exports = router;
