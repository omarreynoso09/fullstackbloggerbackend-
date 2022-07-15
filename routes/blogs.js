var express = require("express");
var router = express.Router();

const { blogsDB } = require("../mongo");
const { serverBlogIsValid } = require("../utils/validation");

router.get("/hello-blogs", (req, res) => {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async function (req, res, next) {
  try {
    console.log(req.query.filterValue);
    const collection = await blogsDB().collection("blogs50");
    const limit = Number(req.query.limit);
    const skip = Number(req.query.limit) * (Number(req.query.page) - 1);
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
    const filterField = req.query.filterField;
    const filterValue = req.query.filterValue;

    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      sortObj = { [sortField]: sortOrder };
    }
    const blogs50 = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    res.json({ message: blogs50 });
  } catch (e) {
    res.status(500).send("Error fetching posts.");
  }
});

router.get("/single-blog/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("blogs50");
    const blogPost = await collection.findOne({ id: blogId });
    res.status(200).json({ message: blogPost, success: true });
  } catch (error) {
    res.status(500).send({
      message: "Error getting the post you requested.",
      success: false,
    });
  }
});

router.post("/blog-submit", async function (req, res, next) {
  try {
    const blogIsValid = serverBlogIsValid(req.body);

    if (!blogIsValid) {
      res.status(400).json({
        message:
          "Please include Title, Author, Category, and Text to submit a blog ",
        success: false,
      });
      return;
    }

    const collection = await blogsDB().collection("blogs50");
    const sortedBlogArray = await collection.find({}).sort({ id: 1 }).toArray();
    const lastBlog = sortedBlogArray[sortedBlogArray.length - 1];
    const title = req.body.title;
    const text = req.body.text;
    const author = req.body.author;
    const category = req.body.category;

    const blogPost = {
      title: title,
      text: text,
      author: author,
      category: category,
      createdAt: new Date(),
      id: Number(lastBlog.id + 1),
      lastModified: new Date(),
    };

    await collection.insertOne(blogPost);
    res.status(200).json({ message: "Post submitted", success: true });
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching posts." + e, success: false });
  }
});

module.exports = router;
