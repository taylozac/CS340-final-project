const express = require("express");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");

// create new router tp handle requests
const router = express.Router();

//
// get recipes for specific user
//
router.get("/user", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  // specific user information is from session/cookie, not info in url
  let currentUser = req.session.username;
  let isSupplier = req.session.isSupplier;

  res.status(200).render("recipes", {
    username: currentUser,
    isSupplier: isSupplier,
    css: ["recipes.css", "recipe_preview_card.css"],
    js: ["recipe_search_bar.js"],
  });
});

//
// recipe home page - view all recipes in the database
//
router.get("/", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  let currentUser = req.session.username;
  let isSupplier = req.session.isSupplier;

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
        username: currentUser,
        isSupplier: isSupplier,
      });
    }
  });
});

//
// Detail view of an individual recipe
//
router.get(
  "/detail/:r_id",
  sessionMiddleware.ifNotLoggedin,
  (req, res, next) => {
    let currentUser = req.session.username;
    let isSupplier = req.session.isSupplier;
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
          js: ["delete_recipe.js"],
          recipe: rows[0],
          username: currentUser,
          isSupplier: isSupplier,
        });
      }
    );
  }
);

//
// create new recipe view
//
router.get("/create", (req, res, next) => {
  let currentUser = req.session.username;
  let isSupplier = req.session.isSupplier;

  res.status(200).render("create_recipe_page", {
    css: ["create_recipe_page.css"],
    js: ["create_recipe.js"],
    username: currentUser,
    isSupplier: isSupplier,
  });
});

//
// handle submitted form for new recipe
//
router.post("/create", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  try {
    // get value from form and create recipe in database
    const { title, author, description } = req.body;

    // try to insert into the database
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

// DELETE RECIPE HELPER FUNCTIONS

// deletes all the uses relationships for a given recipe r_id
function deleteToolsForRecipe(recipeID) {
  try {
    mysql.pool.query(
      "DELETE FROM uses WHERE r_id = ?",
      [recipeID],
      (err) => {
        if (err) {
          throw new Error("Couldn't remove all uses relationships");
        }
      });
  } catch(err) {
    console.log(err.message);
    return false;
  }
  // return true if no errors
  return true;
}

// deletes all the consumes relationships for a given recipe r_id
function deleteIngredientsForRecipe(recipeID) {
  try {
    mysql.pool.query(
      "DELETE FROM consumes WHERE r_id = ?",
      [recipeID],
      (err) => {
        if (err) {
          throw new Error("Couldn't remove all consumes relationships");
        }
      });
  } catch(err) {
    console.log(err.message);
    return false;
  }
  // return true if no errors
  return true;
}

// delete all saves relationships with a given recipe
function deleteSavesForRecipe(recipeID) {
  try {
    mysql.pool.query(
      "DELETE FROM saves WHERE r_id = ?",
      [recipeID],
      (err) => {
        if (err) {
          throw new Error("Couldn't remove all saves relationships");
        }
      });
  } catch (err) {
    console.log(err.message);
    return false;
  }
  // return true if no errors
  return true;
}

// END OF DELETE RECIPE HELPER FUNCTIONS

//
// delete a recipe from the database
// 
router.delete("/delete/:r_id", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  const { r_id } = req.params;

  // removes uses and consumes relationships before deleting recipe
  let ingredientsDeleted = deleteIngredientsForRecipe(r_id);
  let toolsDeleted = deleteToolsForRecipe(r_id);
  let savesDeleted = deleteSavesForRecipe(r_id);

  if (!ingredientsDeleted || !toolsDeleted || !savesDeleted) {
    res.send({ wasSuccess: false });
    return;
  }

  try {
    // try to delete the recipe
    mysql.pool.query(
      "DELETE FROM Recipe r WHERE r.r_id = ?",
      [r_id],
      (err) => {
        if (err) {
          console.log(err);
          res.send({ wasSuccess: false});
        } else {
          res.send({ wasSuccess: true });
        }
      });

  } catch(err) {
    // catch any errors when deleting recipe
    res.send({ wasSuccess: false });
  }

});

//
// Update a recipe -- GET
//
router.get("/update/:r_id", (req, res, next) => {
  const r_id = req.params.r_id;
  const currentUser = req.session.username;
  let isSupplier = req.session.isSupplier;

  try {
    // try to retrieve recipe
    mysql.pool.query(
      "SELECT * FROM Recipe r WHERE r.r_id = ?",
      [r_id],
      (err, rows) => {
        if (err) {
          res.status(500).send("Unable to retrieve selected recipe");
        } else {
          res.status(200).render("update_recipe_page", {
            css: ["create_recipe_page.css"],
            js: ["update_recipe.js"],
            recipe: rows[0],
            username: currentUser,
            isSupplier: isSupplier,
          });
        }
      });

  } catch (err) {
    // catch any errors when retieving recipe for update
    res.status(500).send("Unable to retrieve selected recipe");
  }
});

//
// update a recipe in the database -- PUT
// 
router.put("/update/:r_id", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  const r_id = req.params.r_id;
  const { title, author, description } = req.body;

  // query database with update
  try {
    mysql.pool.query(
      "UPDATE Recipe r SET r.title = ?, r.username = ?, r.directions = ? WHERE r.r_id = ?",
      [title, author, description, r_id],
      (err) => {
        if (err) {
          res.send({ wasSuccess: false });
        } else {
          res.send({ wasSuccess: true });
        }
      });
  } catch(err) {
    res.send({ wasSuccess: false });
  }
});


// export the router
module.exports = router;
