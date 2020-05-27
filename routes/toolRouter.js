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

// VERY IMPORTANT LINE easy for me to forget:
module.exports = router

