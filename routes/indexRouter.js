const express = require("express");
const cookieSession = require("cookie-session");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");

// create new router tp handle requests
const router = express.Router();

//
//  base route leads to login page
//
router.get("/", sessionMiddleware.ifLoggedin, (req, res, next) => {
  res.status(200).redirect("/login");
  //.render("login", { css: ["login.css"], js: ["login_form_validation.js"] });
});

//
// login page route
//
router.get("/login", sessionMiddleware.ifLoggedin, (req, res, next) => {
  res
    .status(200)
    .render("login", { css: ["login.css"], js: ["login_form_validation.js"] });
});

//
// handle login post request
//
router.post("/login", sessionMiddleware.ifLoggedin, (req, res, next) => {
  const { username, password } = req.body;

  try {
    // query database for user
    mysql.pool.query(
      "SELECT * FROM End_User u WHERE u.username = ?",
      [username],
      (err, rows) => {
        // see if existing user is returned
        if (rows && rows.length == 1) {
          try {
            // check password
            let passwordsMatch = password == rows[0].password;

            if (passwordsMatch) {
              // create cookie to track user
              req.session.isLoggedIn = true;
              req.session.username = rows[0].username;

              res.send({ wasSuccess: true });
            } else {
              res.send({
                wasSuccess: false,
                message: "Passwords do not match.",
              });
            }
          } catch (err) {
            res.send({
              wasSuccess: false,
              message: "Username does not exist.",
            });
          }
        } else {
          res.send({ wasSuccess: false, message: "Username does not exist." });
        }
      }
    );
  } catch (err) {
    res.status(500).send("Username and Password not recognized");
  }
});

//
//register page route -- GET
//
router.get("/register", sessionMiddleware.ifLoggedin, (req, res, next) => {
  res
    .status(200)
    .render("register", { css: ["register.css"], js: ["register.js"] });
});

//
// Register page route -- POST
//
router.post("/register", sessionMiddleware.ifLoggedin, (req, res, next) => {
  // get username and password from request
  const { username, password } = req.body;

  // check if username already exists
  try {
    mysql.pool.query(
      "SELECT * FROM End_User u WHERE u.username = ?",
      [username],
      (err, rows) => {
        if (rows.length == 0) {
          // username doesn't exist
          // hash password and create new user
          //let hashedPassword = await bcrypt.hash(password, 12);
          mysql.pool.query(
            "INSERT INTO End_User (username, password) VALUES (?, ?)",
            [username, password],
            (err) => {
              if (err) {
                //handle error
                res.send({ wasSuccess: false });
              } else {
                // send success message to client side
                res.send({ wasSuccess: true });
              }
            }
          );
        } else {
          // username already exists
          res.send({ wasSuccess: false });
        }
      }
    );
  } catch (err) {
    // handle error
    req.render("error", { status: 500, message: "Something went wrong 🤷‍♂️" });
  }
});




//
//register supplier page route -- GET
//
router.get("/register_supplier", sessionMiddleware.ifLoggedin, (req, res, next) => {
  res
    .status(200)
    .render("register_supplier", { css: ["register.css"], js: ["register_supplier.js"] });
});

//
// Register supplier page route -- POST
//
router.post("/register_supplier", sessionMiddleware.ifLoggedin, (req, res, next) => {
  // get username and password from request
  const { username, password, companyname } = req.body;

  // check if username already exists
  try {
    mysql.pool.query(
      "SELECT * FROM End_User u WHERE u.username = ?",
      [username],
      (err, rows) => {
        if (rows.length == 0) {
          // username doesn't exist
          // hash password and create new user
          //let hashedPassword = await bcrypt.hash(password, 12);
          mysql.pool.query(
              //We add TRUE to the user to make them a supplier
            "INSERT INTO End_User (username, password) VALUES (?, ?)",
            [username, password],
            (err) => {
              if (err) {
                //handle error
                res.send({ wasSuccess: false });
              } else {
                // send success message to client side
                res.send({ wasSuccess: true });
              }
            }
          );
        } else {
          // username already exists
          res.send({ wasSuccess: false });
        }
          
          
          
          
          
      }
    );
  } catch (err) {
    // handle error
    req.render("error", { status: 500, message: "Something went wrong 🤷‍♂️" });
  }
});


//
// logout
//
router.get("/logout", (req, res, next) => {
  req.session = null;
  res
    .status(200)
    .render("login", { css: ["login.css"], js: ["login_form_validation.js"] });
});

//
// Homepage
//
router.get("/home", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  let currentUser = req.session.username;
  res.status(200).render("home", { css: ["home.css"], username: currentUser });
});

// export the router
module.exports = router;