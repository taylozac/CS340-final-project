// toolRouter.js
// Handles tool-related database operations

const express = require("express");
const mysql = require("../dbcon.js"); // Not sure if this should be a hard-
                                      // -coded path...
const sessionMiddleware = require("../sessionMiddleware.js");
const async = require("async"); //???

const router = express.Router();

// No tools homepage, panic.
router.get("/", (req, res, next)=>{
    res.status(500).send("There is no tools home page.");
});

// Show the details for a particular tool.
router.get("/:t_id", sessionMiddleware.ifNotLoggedin, (req, res, next)=>{
    let current_user = req.session.username;
    let isSupplier = req.session.isSupplier;
    let tool_id = req.params.t_id;
    mysql.pool.query(
        "SELECT * FROM Tool t WHERE t.t_id = ?",
        [req.params.t_id],
        function (err, rows, fields) { // error handler
            if(err) // If there was an error
            {
                res.status(500).send("Couldn't find that tool: " + tool_id);
                //return;
            }

            // Query 2: Get the suppliers of this tool.
            mysql.pool.query(
                "SELECT s.name, s.username FROM Supplier s INNER JOIN manufactures m ON m.s_id = s.s_id WHERE m.t_id = ?",
                [req.params.t_id],
                function (err2, results_2)
                {
                    var supplier_rows = [];
                    var username_owns_tool = false;
                    //console.log("Loading tool details...");
                    //console.log(results_2);
                    if(!err) {
                        for(i = 0; i < results_2.length; i++){
                            if(results_2[i].username == current_user){
                                username_owns_tool = true;
                            }
                        }
                        supplier_rows = results_2;
                    }
                    res.status(200).render("tool_detail", {
                        css: ["tool_detail.css"],
                        tool: rows[0],
                        username: current_user,
                        isSupplier: isSupplier,
                        suppliers: supplier_rows,
                        owns_tool: username_owns_tool,
                        t_id: req.params.t_id
                    }); // end res.status
                }
            );
        } // end response function
    ); // End mysql.pool.query
}); // End router.get()

// Update Tool
router.post("/update/:t_id", sessionMiddleware.ifNotLoggedin, (req, res, next)=>{
  try{
    /* 1. Determine the parameters passed into the update. */
    const { name_n, desc_n } = req.body;
    var to_update = req.params.t_id;
    console.log("Updating tool \"" + name_n + "\" (" + desc_n + "), where t_id = " + to_update);
    mysql.pool.query(
        "UPDATE Tool SET name = ?, description = ? WHERE t_id = ?;",
        [name_n, desc_n, to_update],
        function(error, result){
            if(error){
                    res.status(500).send("Error updating tool. " + error);
                }
                else
                    res.status(200).redirect("/tools/" + req.params.t_id);
        }
    );
  } catch(js_err) {
    res.status(500).send("Unexpected node.js exception while updating tool.");
  }
}); // End router.post

// Delete Tool
router.post("/delete/:t_id", sessionMiddleware.ifNotLoggedin, (req, res, next)=>{
  try{
    mysql.pool.query(
        "DELETE FROM manufactures WHERE t_id = ?; DELETE FROM uses WHERE t_id = ?; DELETE FROM Tool WHERE t_id = ?;",
        [req.params.t_id, req.params.t_id, req.params.t_id],
        function(error, result){
            if(error)
                res.status(500).send("Error deleting tool: " + error);
            else
                res.status(200).redirect("/home");
        }
    );
  } catch(js_err) {
    res.status(500).send("Unexpected node.js exception while updating tool.");
  }
}); // End router.post

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
