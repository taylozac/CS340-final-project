const express = require("express");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");

const router = express.Router();

//
// Possibly have default that displays all tools?
//
router.get("/", (req, res, next) => {
    res.send("Page DNE");
});


router.get("/:i_id", sessionMiddleware.ifNotLoggedin, (req, res, next) => {

    let isSupplier = req.session.isSupplier;
    let current_user = req.session.username;
    let req_i_id = req.params.i_id;

    mysql.pool.query(

        //
        // Query for specific ingredient.
        //
        "SELECT * FROM Ingredient i WHERE i.i_id = ${req_i_id}",

        //
        // Error handler
        //
        function (err, rows, fields) {

            //
            // If there was an error, send a message that we couldn't find the
            // specified ingredient.
            //
            if (err) {
                res.status(500).send("Couldn't find that ingredient.");
            }

            //
            // If there was no error in our SQL query, send the ingredient.
            //
            res.status(200).render("ingredient_detail", {
                css: [main.css],
                ingredient: rows[0],
                username: current_user,
                isSupplier: isSupplier,
            });
        }
    );
});

module.exports = router;
