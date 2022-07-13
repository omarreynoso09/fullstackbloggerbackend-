var express = require("express");
var router = express.Router();

const { blogsDB } = require("../mongo");
const { serverBlogIsValid } = require("../utils/validation");

router.get("/admin/blog-list", async (req, res, next) => {
  try {
    const collection = await blogsDB().collection("posts50");
    const blogs = await collection
      .find({})
      .projection({ id: 1, title: 1, author: 1, createdAt: 1, lastModified: 1 })
      .toArray();
  } catch (error) {}
});

router.put("/admin/edit-blog", async (req, res) => {
  try {
    const updateBlogIsValid = serverBlogIsValid(req.body);
    if (!updateBlogIsValid) {
      res
        .status(400)
        .json({ message: "Blog update is not valid", success: false });
      return;
    }
    const newPostData = req.body;
    const date = new Date();
    const updateBlog = { ...newPostData, lastModified: date };
    await collection.updateOne(
      { id: newPostData.id },
      { $set: { ...updateBlog } }
    );
    res.status(200).json({ message: "Blog update succes", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating your blgo" + error, success: false });
  }
});

router.delete("/delete-blog/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("blog50");
    const blogToDelete = await collection.deleteOne({ id: blogId });
    if (blogToDelete.deletedCount === 1) {
      res.json({ message: "Deleted", success: true }).status(200);
    } else {
      res.json({ message: "Not Succesful", success: false }).status(204);
    }
  } catch (error) {
    res.status(500).json({ message: "Error " + error, success: false });
  }
});
