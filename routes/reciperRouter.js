const express = require("express");
const mysql = require("../dbcon.js");

// create new router tp handle requests
const router = express.Router();

//
// recipe home page - view all recipes in the database
//
router.get("/", (req, res, next) => {
  // qeury dataebase for all recipes
  mysql.pool.query("SELECT * FROM Recipe", function (err, rows, fields) {
    if (err) {
      res.status(500).send("Couldn't retrieve the recipes.");
    } else {
      // send queried data in response
      res.status(200).render("recipes", {
        css: ["recipes.css", "recipe_preview_card.css"],
        js: ["recipe_search_bar.js"],
        recipes: rows,
      });
    }
  });
});

//
// get recipes for specific user
//
router.get("/user/:u_id", (req, res, next) => {
  let userID = req.params.u_id;
  res.status(200).render("recipes", {
    userID: userID,
    css: ["recipes.css", "recipe_preview_card.css"],
    js: ["recipe_search_bar.js"],
  });
});

//
// Detail view of an individual recipe
//
router.get("/detail/:r_id", (req, res, next) => {
  let recipeID = req.params.r_id;
  mysql.pool.query(
    `SELECT * FROM Recipe r WHERE r.r_id = ${recipeID}`,
    function (err, rows, fields) {
      if (err) {
        res.status(500).send("Couldn't retrieve the recipe.");
      }
      // send queried data in response
      res.status(200).render("recipe_detail", {
        css: ["recipe_detail.css"],
        recipe: rows[0],
      });
    }
  );
});

//
// create new recipe view
//
router.get("/create", (req, res, next) => {
  res.status(200).render("create_recipe_page", {
    css: ["create_recipe_page.css"],
    js: ["create_recipe.js"],
  });
});

//
// handle submitted form for new recipe
//
router.post("/create", (req, res, next) => {
  try {
    // get value from form and create recipe in database
    const { title, author, description } = req.body;

    // try to insert into the database
    console.log("querying");
    mysql.pool.query(
      "INSERT INTO Recipe (title, directions, username) VALUES(?, ?, ?)",
      [title, description, author],
      function (err, result) {
        if (err) {
          res.status(500).send("Couldn't create the recipe.");
        } else {
          res.status(200).send("recipe created");
        }
      }
    );
  } catch (err) {
    // server error
    res.status(500).send("Couldn't create the recipe.");
  }
});

// export the router
module.exports = router;
