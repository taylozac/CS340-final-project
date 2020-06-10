const express = require("express");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");
const promise = require("bluebird");

// create new router tp handle requests
const router = express.Router();


// SAVE POST HELPER FUNCTIONS
function isRecipeAlreadySaved(username, recipeId) {
  return new Promise((resolve, reject) => {

    mysql.pool.query(
      "SELECT * FROM saves WHERE username = ? AND r_id = ?",
      [username, recipeId],
      (err, rows) => {
        if (err) {
          resolve(false);
        } else if (rows && rows.length == 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });

  })

}

function saveRecipeForUser(username, recipeId) {
  return new Promise((resolve, reject) => {
    try {
      mysql.pool.query(
        "INSERT INTO saves(username, r_id) VALUES (?, ?)",
        [username, recipeId],
        (err) => {
          if (err) {
            throw new Error("Unable to save recipe.");
          } else {
            resolve(true);
          }
        });
    } catch (err) {
      reject("Unable to save recipe");
    }
  });

}
// END OF SAVE POST HELPER FUNCTIONS

//
// Save a recipe
//
router.post("/save", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  const { recipeId } = req.body;
  const currentUser = req.session.username;

  isRecipeAlreadySaved(currentUser, recipeId) // check if recipe is already saved
    .then((alreadySaved) => {
      if (!alreadySaved) { //if promise resolves to true, save the recipe
        saveRecipeForUser(currentUser, recipeId)
          .then(wasSuccess => res.send({ wasSuccess }))
          .catch((err) => res.send({ wasSuccess: false }))
      } else {
        res.send({ wasSuccess: false, alreadySaved: true })
      }
    })
    .catch((err) => res.send({ wasSuccess: false, alreadySaved: true }));
});

//
// get recipes for specific user
//
router.get("/user", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  // specific user information is from session/cookie, not info in url
  let currentUser = req.session.username;
  let isSupplier = req.session.isSupplier;

  try {
    mysql.pool.query(
      "SELECT * FROM Recipe WHERE r_id IN (SELECT r_id FROM saves WHERE username = ?)",
      [currentUser],
      (err, rows) => {
        if (!err) {
          res.status(200).render("recipes", {
            username: currentUser,
            isSupplier: isSupplier,
            recipes: rows,
            isUserRecipes: true,
            css: ["recipes.css", "recipe_preview_card.css"],
            js: ["recipe_search_bar.js"],
          });
        }
      });
  } catch (err) {
    // if error return empty list
    res.status(500).send("couldn't retrieve user recipes.");
  }


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
        isUserRecipes: false,
      });
    }
  });
});

//
// RECIPE DETAIL HELPER GET FUNCTIONS
//
function getAllIngredientsForRecipe(recipeId) {
  return new Promise((resolve, reject) => {
    // qeury dataebase for all recipes
    // SELECT * FROM Ingredient WHERE i_id IN (SELECT i_id FROM consumes WHERE r_id = ?)
    mysql.pool.query("CALL GET_INGREDIENTS_FOR_RECIPE(?)",
      [recipeId],
      (err, rows, fields) => {
        if (!err && rows) {
          resolve(rows);
        } else {
          reject("unable to retrieve ingredients");
        }
      });
  })
}

function getAllToolsForRecipe(recipeId) {
  return new Promise((resolve, reject) => {
    // qeury dataebase for all recipes
    mysql.pool.query("SELECT * FROM Tool WHERE t_id IN (SELECT t_id FROM uses WHERE r_id = ?)",
      [recipeId],
      (err, rows, fields) => {
        if (!err && rows) {
          resolve(rows);
        } else {
          reject("unable to retrieve tools");
        }
      });
  })
}

//
// END OF RECIPE DETAIL HELPER GET FUNCTIONS
//

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

    let ingredientsPromise = getAllIngredientsForRecipe(recipeID);
    let toolsPromise = getAllToolsForRecipe(recipeID);

    promise.join(ingredientsPromise, toolsPromise, (ingredients, tools) => {
      mysql.pool.query(
        "SELECT * FROM Recipe r WHERE r.r_id = ?",
        [recipeID],
        function (err, rows, fields) {
          if (err) {
            res.status(500).send("Couldn't retrieve the recipe.");
          }
          // send queried data in response
          res.status(200).render("recipe_detail", {
            css: ["recipe_detail.css"],
            js: ["delete_recipe.js", "save_recipe.js"],
            recipe: rows[0],
            username: currentUser,
            isSupplier: isSupplier,
            ingredients: ingredients,
            tools: tools,
          });
        }
      );
    })
  }
);

//
// CREATE RECIPE HELPER GET FUNCTIONS
//
function getAllIngredients() {
  return new Promise((resolve, reject) => {
    // qeury dataebase for all recipes
    mysql.pool.query("SELECT * FROM Ingredient", (err, rows, fields) => {
      if (err) {
        reject("unable to retrieve ingredients");
      } else {
        resolve(rows);
      }
    });
  })
}

function getAllTools() {
  return new Promise((resolve, reject) => {
    // qeury dataebase for all recipes
    mysql.pool.query("SELECT * FROM Tool", (err, rows, fields) => {
      if (err) {
        reject("unable to retrieve tools");
      } else {
        resolve(rows);
      }
    });
  })
}

//
// END OF CREATE RECIPE GET HELPER FUNCTIONS
//

//
// create new recipe view
//
router.get("/create", (req, res, next) => {
  let currentUser = req.session.username;
  let isSupplier = req.session.isSupplier;

  let ingredientsPromise = getAllIngredients();
  let toolsPromise = getAllTools();

  promise.join(ingredientsPromise, toolsPromise, (ingredients, tools) => {
    res.status(200).render("create_recipe_page", {
      css: ["create_recipe_page.css"],
      js: ["create_recipe.js"],
      username: currentUser,
      isSupplier: isSupplier,
      tools: tools,
      ingredients: ingredients,
    });
  });
});

// CREATE NEW RECIPE POST HELPER FUNCTION

// function gets the ID of the recipe that was just created
function getIdForNewlyCreatedRecipe(title, description, author) {
  return new Promise((resolve, reject) => {
    mysql.pool.query(
      "SELECT r_id FROM Recipe WHERE title = ? AND directions = ? AND username = ?",
      [title, description, author],
      function (err, rows) {
        if (!err && rows) {
          resolve(rows[0]);
        }
        else {
          reject("unable to retrieve recipe");
        }
      }
    );
  })
}

// function adds a new consumes relationship to database for ingredient and recipe
function addRecipeIngredient(ingredientId, recipeId, amount = 1) {
  try {
    mysql.pool.query(
      "INSERT INTO consumes(r_id, i_id, amount) VALUES(?, ?, ?)",
      [recipeId, ingredientId, amount],
      (err) => {
        if (err) {
          throw new Error("Couldn't add ingredient to recipe");
        }
      });
  } catch (err) {
    console.log(err.message);
    return false;
  }
  // return true if no errors
  return true;
}

//function adds a new uses relationship to database between tool and recipe
function addRecipeTool(toolId, recipeId) {
  try {
    mysql.pool.query(
      "INSERT INTO uses(r_id, t_id) VALUES(?, ?)",
      [recipeId, toolId],
      (err) => {
        if (err) {
          throw new Error("Couldn't add tool to recipe");
        }
      });
  } catch (err) {
    console.log(err.message);
    return false;
  }
  // return true if no errors
  return true;
}

// adds all tools in list to recipe via uses relationship
function addAllToolsToRecipe(recipeId, tools) {
  for (tool of tools) {
    addRecipeTool(tool, recipeId);
  }
}

// adds all ingredients in list to recipe via consumes relationship
function addAllIngredientsToRecipe(recipeId, ingredients) {
  for (ingredient of ingredients) {
    addRecipeIngredient(ingredient, recipeId);
  }
}

// END OF CREATE NEW RECIPE POST HELPER FUNCTION

//
// handle submitted form for new recipe
//
router.post("/create", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  try {
    // get value from form and create recipe in database
    const { title, author, description, tools, ingredients } = req.body;
    // try to insert into the database
    mysql.pool.query(
      "INSERT INTO Recipe (title, directions, username) VALUES(?, ?, ?)",
      [title, description, author],
      function (err, result) {
        if (err) {
          res.status(500).send("Couldn't create the recipe.");
        } else {
          getIdForNewlyCreatedRecipe(title, description, author)
            .then((recipeId) => {
              addAllIngredientsToRecipe(recipeId.r_id, ingredients);
              addAllToolsToRecipe(recipeId.r_id, tools);
            })
            .then(() => {
              res.status(200).send("recipe created");
            })
            .catch(() => {
              res.status(500).send("Couldn't create the recipe.");
            })
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
  } catch (err) {
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
  } catch (err) {
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
      "DELETE FROM Recipe WHERE r_id = ?",
      [r_id],
      (err) => {
        if (err) {
          console.log(err);
          res.send({ wasSuccess: false });
        } else {
          res.send({ wasSuccess: true });
        }
      });

  } catch (err) {
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
  } catch (err) {
    res.send({ wasSuccess: false });
  }
});


// export the router
module.exports = router;
