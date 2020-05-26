const express = require("express");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");

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

//register page route -- GET
router.get("/register", sessionMiddleware.ifLoggedin, (req, res, next) => {
  res
    .status(200)
    .render("register", { css: ["register.css"], js: ["register.js"] });
});

// Register page route -- POST
router.post("/register", (req, res, next) => {
  const { username, password } = req.body;

  // check if username already exists
  try {
    mysql.pool.query(
      "SELECT * FROM End_User u WHERE u.username = ?",
      [username],
      function (err, rows, fields) {
        // if rows in database, then username already exists
        if (rows.length !== 0) {
          res.status(500).send({ message: "That username is already taken" });
        } else {
          // otherwise create new user
          try {
            mysql.pool.query(
              "INSERT INTO End_User(username, password) VALUES(?, ?)",
              [username, password],
              (err) => {
                res.status(200).render("home", { css: ["home.css"] });
              }
            );
          } catch (err) {
            res.status(500).send("An error occurred, please try again later!");
          }
        }
      }
    );
  } catch (err) {
    res.status(500).send("An error occurred, please try again later!");
  }
});

router.get("/home", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  res.status(200).render("home", { css: ["home.css"] });
});

// export the router
module.exports = router;
