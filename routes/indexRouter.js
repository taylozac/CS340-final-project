const express = require("express");
const mysql = require("../dbcon.js");

// create new router tp handle requests
const router = express.Router();

//  base route leads to login page
router.get("/", (req, res, next) => {
  res
    .status(200)
    .render("login", { css: ["login.css"], js: ["login_form_validation.js"] });
});

// login page route
router.get("/login", (req, res, next) => {
  res
    .status(200)
    .render("login", { css: ["login.css"], js: ["login_form_validation.js"] });
});

// handle login post request
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  // TODO: query database to check if user exist

  res.status(400).send("success");
});

//register page route
router.get("/register", (req, res, next) => {
  res.status(200).render("register", { css: ["register.css"] });
});

router.get("/home", (req, res, next) => {
  res.status(200).render("home", { css: ["home.css"] });
});

// export the router
module.exports = router;
