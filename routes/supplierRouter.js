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
    let currentUser = req.session.username; // Needed?
    res.status(200).render(
        "add_tool_page",
        { css: ["add_tool.css"], username: currentUser }
    );
});

// Allow synthesis of new tool using existing form.
// I was originally going to do this in the tool router but I changed my mind.
router.post("/add_tool", sessionMiddleware.ifNotLoggedin, (req, res, next)=>{
    try {
        const { name, description } = req.body;

        mysql.pool.query(
            "INSERT INTO Tool (name, description) VALUES(?, ?)",
            [name, description],
            function (err, result) {
                if(err)
                    res.status(500).send("Error creating tool.");
                else
                    res.status(200).send("Created tool.");
            }
        ); // end query
    } catch (err) {
        res.status(500).send("Unexpected exception while creating tool.");
    } // end catch
}); // end router.post

module.exports = router;
