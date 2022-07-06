const express = require("express");
const router = express.Router();
const { blogsDB } = require("../mongo");
router.get("/hello-blogs", (req, res, next) => {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async (req, res) => {
  try {
    const collection = await blogsDB().collection("blogs50");
    const posts = await collection.find({}).toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).send("error fetching posts " + error);
  }
});

module.exports = router;
