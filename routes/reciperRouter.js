const express = require("express");
const mysql = require("../dbcon.js");
const sessionMiddleware = require("../sessionMiddleware.js");

// create new router tp handle requests
const router = express.Router();

// recipe home page
router.get("/", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  res
    .status(200)
    .render("recipes", { css: ["recipes.css", "recipe_preview_card.css"] });
});

//get recipes for specific user
router.get("/user/:u_id", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  let userID = req.params.u_id;
  res.status(200).render("recipes", {
    userID: userID,
    css: ["recipes.css", "recipe_preview_card.css"],
  });
});

// recipe detail view
router.get(
  "/detail/:r_id",
  sessionMiddleware.ifNotLoggedin,
  (req, res, next) => {
    let recipeID = req.params.r_id;
    res
      .status(200)
      .render("recipe_detail", { r_id: recipeID, css: ["recipe_detail.css"] });
  }
);

// create new recipe view
router.get("/create", sessionMiddleware.ifNotLoggedin, (req, res, next) => {
  res
    .status(200)
    .render("create_recipe_page", { css: ["create_recipe_page.css"] });
});

// export the router
module.exports = router;
