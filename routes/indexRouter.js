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
// Helper function to check if the user logging in is a supplier
//
function isUserSupplier(username) {
  // query database to check if the user is a supplier
  var isSupplier;

  try {
    mysql.pool.query(
      "SELECT * FROM Supplier s WHERE s.username = ?",
      [username],
      (err, rows) => {
        if (rows && rows.length == 1) {
          return true;
        } else {
          return false;
        }
      });
  } catch(err) {
    isSupplier = false;
  }
  return isSupplier;
};


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
            // check password
            let passwordsMatch = password == rows[0].password;
            let username = rows[0].username;

            if (passwordsMatch) {
              try { // if passwords match, check if the user is a supplier
                mysql.pool.query(
                  "SELECT * FROM Supplier s WHERE s.username = ?",
                  [username],
                  (err, rows) => {
                    if (rows && rows.length == 1) {
                      req.session.isLoggedIn = true;
                      req.session.isSupplier = true;
                    } else {
                      req.session.isLoggedIn = true;
                      req.session.isSupplier = false;
                    }

                    req.session.username = username;
                    res.send({ wasSuccess: true });
                  });
              } catch (err) { // catch any errors while checking if user is a supplier
                res.send({
                  wasSuccess: false,
                  message: "Error ooccurred while checking if user was a supplier",
                });
              }
            } else { // catch any errors while checking if passwords match
              res.send({
                wasSuccess: false,
                message: "Passwords do not match.",
              });
            }
        } else { // if username did not return any rows
          res.send({ wasSuccess: false, message: "Username does not exist." });
        }
      }
    );
  } catch (err) { // catch any other errors
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
  const { username, password, supplier} = req.body;
    console.log(username);
    console.log(password);
    console.log(supplier);


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
                   mysql.pool.query(
                       "INSERT INTO Supplier (name, username) VALUES (?,?)",
                       [supplier, username],
                       (err) => {
                           if (err){
                              res.send({ wasSuccess: false });
                           }
                       }
                   );

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
// change_password page route -- GET
//

router.get("/change_password", sessionMiddleware.ifLoggedin, (req, res, next) => {
    console.log("We are here!");

  res
    .status(200)
    .render("change_password", { css: ["register.css"], js: ["change_password.js"] });
});

//
// change_password page route -- POST
//
router.post("/change_password", sessionMiddleware.ifLoggedin, (req, res, next) => {
  // get username and password from request
  const { username, password} = req.body;
  // check if username already exists
  try {
      //We are going to assume that since we are logged in, the user account exists.

          mysql.pool.query(
              //We add TRUE to the user to make them a supplier
            "UPDATE End_User SET password = ? WHERE username = ?",
            [password, username],
            (err) => {
              if (err) {
                //handle error
                console.log("ERROR in password reset!");
                res.send({ wasSuccess: false });
              } else {
                // send success message to client side
                  console.log("Successfully changed password!");
                res.redirect("/login");
              }
            }
          );
  } catch (err) {
    // handle error
    req.render("error", { status: 500, message: "Something went wrong ?????" });
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
  let isSupplier = req.session.isSupplier;
  res.status(200).render("home", { css: ["home.css"], username: currentUser, isSupplier: isSupplier });
});

// export the router
module.exports = router;
