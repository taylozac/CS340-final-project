const express = require("express");
const mysql = require("../dbcon.js");

const router = express.Router();

// supplier home page
router.get("/", (req, res, next) => {
  res.status(200).render("supplier", { css: [] });
});

module.exports = router;
