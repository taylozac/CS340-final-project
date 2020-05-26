const express = require("express");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");

const router = express.Router();

// supplier home page
router.get("/", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  let currentUser = req.session.username;
  res
    .status(200)
    .render("supplier", { css: ["supplier.css"], username: currentUser });
});

// add new ingredient page
router.get(
  "/add_ingredient",
  sessionMiddleware.ifNotLoggedin,
  (req, res, next) => {
    let currentUser = req.session.username;
    res.status(200).render("add_ingredient_page", {
      css: ["add_ingredient.css"],
      username: currentUser,
    });
  }
);

// add new tool page
router.get("/add_tool", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  res
    .status(200)
    .render("add_tool_page", { css: ["add_tool.css"], username: currentUSer });
});

module.exports = router;
