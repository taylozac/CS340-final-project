// toolRouter.js
// Handles tool-related database operations

const express = require("express");
const mysql = require("../dbcon.js"); // Not sure if this should be a hard-
                                      // -coded path...
const sessionMiddleware = require("../sessionMiddleware.js");

const router = express.Router();

// No tools homepage, panic.
router.get("/", (req, res, next)=>{
    res.send("There is no tools home page");
});

// Show the details for a particular tool.
router.get("/:t_id", sessionMiddleware.ifNotLoggedin, (req, res, next)=>{
    let current_user = req.session.username;
    let tool_id = req.params.t_id;
    mysql.pool.query(
        `SELECT * FROM Tool t WHERE t.t_id = ${tool_id}`,
        function (err, rows, fields) { // error handler
            if(err) // If there was an error
                res.status(500).send("Couldn't find that tool: " + tool_id);
            res.status(200).render("tool_detail", {
                css: [tool_detail.css],
                tool: rows[0],
                username: currentUser
            }); // end res.status
        } // end response function
    ); // End mysql.pool.query
}); // End router.get()

/* If you want to add tool creation that's fine, and you'd do so here,
 * but for now this router will just be for SELECT queries (that you don't
 * have to be a supplier to see)
// Add a new tool to the database.
router.post("/create", sessionMiddleware.ifNotLoggedin, (req, res, next)=>{
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
*/

// VERY IMPORTANT LINE easy for me to forget:
module.exports = router

