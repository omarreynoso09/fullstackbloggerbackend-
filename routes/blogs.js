var express = require("express");
var router = express.Router();

router.get("/hello-blogs", function (req, res, next) {
  res.json({ message: "hello from express" });
});

module.exports = router;
