var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");
const { serverBlogIsValid } = require("../utils/validation");

router.get("/admin/blog-list", async (req, res, next) => {
  try {
    const collection = await blogsDB().collection("blogs50");
    const blogs50 = await collection
      .find({})
      .project({
        title: 1,
        author: 1,
        createdAt: 1,
        lastModified: 1,
        id: 1,
      })
      .toArray();
    res.status(200).json({ message: blogs50, success: true });
  } catch (e) {
    res.status(500).json({ message: "Error fetching posts.", success: false });
  }
});

router.put("/edit-blog", async function (req, res, next) {
  const blogId = req.body.blogId;
  const title = req.body.title;
  const text = req.body.text;
  const author = req.body.author;

  const newBlogPost = {
    title,
    text,
    author,
    createdAt: new Date(),
    lastModified: new Date(),
  };

  try {
    const collection = await blogsDB().collection("blogs50");
    await collection.updateOne(
      {
        id: blogId,
      },
      {
        $set: {
          ...newBlogPost,
        },
      }
    );
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.json({ success: false });
  }
});

router.delete("/delete-blog/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("blogs50");
    const blogToDelete = await collection.deleteOne({ id: blogId });
    if (blogToDelete.deletedCount === 1) {
      res.status(200).json({ message: "Successfully deleted.", message: true });
    } else {
      res.status(204).json({ message: "Delete unsuccessful.", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" + error, success: false });
  }
});

module.exports = router;
