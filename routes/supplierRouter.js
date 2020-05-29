const express = require("express");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");
const async = require("async"); //Required to allow for the multiple SQL queries.

const router = express.Router();

// supplier home page
router.get("/", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
try {
    let currentUser = req.session.username;
    // This SQL query could use work if we violate the assumption that all
    // users only manage exactly one supplier if they manage one.
    // Also, I'm not sure how to expand this to include ingredients. Is it possible
    // to double-up queries? Might no longer be appropriate to call the page
    // parameter "tools" anymore.

    var return_data = {};

    mysql.pool.query(
        "SELECT t.name, t.description FROM Tool t INNER JOIN manufactures m ON m.t_id = t.t_id INNER JOIN Supplier sup ON sup.s_id = m.s_id WHERE username=? ORDER BY t.t_id DESC;",
        [currentUser], // This parameter is given to the SQL.
        //function(err, tool_rows, fields) {
        function(err, results) {
            console.log(results);
            if(!err) { // No SQL Error
                //
                // If there is not an error store our results in return_data.
                //
                return_data.currentUser = currentUser;
                return_data.tools = results;

            } else {
                res.status(500).send("Couldn't load the tools...\n" + err);
            }
        } // end SQL result handler
    ); // end SQL query block

    mysql.pool.query(
        "SELECT i.name, i.description FROM Ingredient i INNER JOIN stocks s ON s.i_id = i.i_id INNER JOIN Supplier sup ON sup.s_id = s.s_id WHERE username=? ORDER BY i.i_id DESC;",
        [currentUser], // This parameter is given to the SQL.
        function(err, results) {

            //
            // If there is not an error store our results in return_data.
            //
            if(!err) {
                return_data.ingredients = results;
            } else {
                res.status(500).send("Couldn't load the tools...\n" + err);
            }
        } // end SQL result handler
    ); // end SQL query block

    console.log();
    console.log();

    res.status(200).render("supplier", {
        css: ["supplier.css"],
        username: return_data.currentUser,
        ingredients: return_data.ingredients,
        tools: return_data.tools//, Next should be ingredients
    }); // End render*/



/*
    let found_tools = mysql.pool.query(
        "SELECT t.name, t.description FROM Tool t INNER JOIN manufactures m ON m.t_id = t.t_id INNER JOIN Supplier s ON s.s_id = m.s_id WHERE username=? ORDER BY t.t_id DESC;",
        [currentUser], // This parameter is given to the SQL.
        function(err, rows, fields) {
            if(err) {
                res.status(500).send("Couldn't load the tools...\n" + err);
            }
        } // end SQL result handler
    ); // end SQL query block

    console.log(found_tools);

    res.status(200).render("supplier", {
        css: ["supplier.css"],
        username: currentUser,
        tools: found_tools.rows
    });
*/

} catch(unknown) {
    res.status(500).send("Unknown error detected while loading ingredients and tools...");
} // end try catch
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
        // TODO: Update this logic so if the tool already exists a reference
        // is instead made to it.
        // I was trying to do a stored procedure for this but was unable to get it to work ideally. So instead
        // I am working on just trying to do a multi-line statement.
        //var my_sql_con = mysql.createConnection({multipleStatements: true});
        //my_sql.pool.multipleStatements = true;
        mysql.pool.query(
            "INSERT INTO Tool (name, description) VALUES(?, ?); INSERT INTO manufactures (s_id, t_id) VALUES ((SELECT s_id FROM Supplier WHERE username = ?), (SELECT t_id FROM Tool WHERE name = ? AND description = ?))",
            [name, description, req.session.username, name, description],
            function (err, result) {
                if(err)
                {
                    //my_sql.pool.multipleStatements = false;
                    res.status(500).send("Error creating tool.\n" + err);
                }
                else
                {
                    //my_sql.pool.multipleStatements = false;
                    // Tool created; now register it with the manufacturer.
                    //mysql.pool.query("CALL registerUserNewTool(?, ?)",
                    // I couldn't figure out stored procedures so I'm doing
                    // this instead for now:
                    //res.status(200).send("Created tool and registered with manufacturer");
                    res.status(200).redirect("/supplier");
                }
            }
        ); // end query
    } catch (err) {
        //my_sql.pool.multipleStatements = false;
        res.status(500).send("Unexpected exception while creating tool.");
    } // end catch
}); // end router.post

//
// This is virtually identical to the above code for adding a tool since they are
// basically the same process. I will find something else to do as well.
//
router.post("/add_ingredient", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
    try {
        const { name, description } = req.body;
        mysql.pool.query(
            "INSERT INTO Ingredient (name, description) VALUES(?, ?); INSERT INTO stocks (s_id, i_id) VALUES ((SELECT s_id FROM Supplier WHERE username = ?), (SELECT i_id FROM Ingredient WHERE name = ? AND description = ?))",
            [name, description, req.session.username, name, description],
            function (err, result) {
                if(err)
                {
                    res.status(500).send("Error creating ingredient.\n" + err);
                }
                else
                {
                    res.status(200).redirect("/supplier");
                }
            }
        );
    } catch (err) {
        res.status(500).send("Unexpected exception while creating ingredient.");
    }
});

module.exports = router;
