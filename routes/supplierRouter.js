const express = require("express");
const mysql = require("../dbcon.js");

const router = express.Router();

// supplier home page
router.get("/", (req, res, next) => {
  res.status(200).render("supplier", { css: ["supplier.css"] });
});

// add new ingredient page
router.get("/add_ingredient", (req, res, next) => {
  res
    .status(200)
    .render("add_ingredient_page", { css: ["add_ingredient.css"] });
});

// add new tool page
router.get("/add_tool", (req, res, next) => {
  res.status(200).render("add_tool_page", { css: ["add_tool.css"] });
});

module.exports = router;
