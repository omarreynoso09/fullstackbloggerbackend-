var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");

router.get("/blog-list", async function (req, res, next) {
  try {
    const collection = await blogsDB().collection("posts");
    const posts = await collection
      .find({})
      .project({
        text: 0,
        category: 0,
        _id: 0,
      })
      .toArray();
    res.json(posts);
  } catch (e) {
    res.status(500).send("Error fetching blog list.");
  }
});

router.put("/edit-blog", async function (req, res, next) {
  try {
    const title = req.body.title;
    const author = req.body.author;
    const text = req.body.text;
    const id = req.body.id;

    const collection = await blogsDB().collection("posts");
    const updatedPost = {
      title,
      text,
      author,
      lastModified: new Date().toISOString(),
    };
    await collection.updateOne(
      {
        id: blogId,
      },
      {
        $set: {
          ...updatedPost,
        },
      }
    );
    res.send("Post updated.");
  } catch (e) {
    res.status(500).send("Error updating post.");
  }
});

router.delete("/delete-blog/:blogId", async function (req, res, next) {
  try {
    const blogId = Number(req.params.blogId);

    const collection = await blogsDB().collection("posts");
    await collection.deleteOne({
      id: blogId,
    });
    res.send("Post deleted.");
  } catch (e) {
    res.status(500).send("Error deleting post.");
  }
});

module.exports = router;
