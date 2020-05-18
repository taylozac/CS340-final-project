const express = require("express");
const mysql = require("../dbcon.js");

// create new router tp handle requests
const router = express.Router();

// recipe home page
router.get("/", (req, res, next) => {
  res.status(200).render("recipes");
});

// recipe detail view
router.get("/:r_id", (req, res, next) => {
  let recipeID = req.params.r_id;
  res.status(200).render("recipe_detail", { r_id: recipeID });
});

//get recipes for specific user
router.get("/user/:u_id", (req, res, next) => {
  let userID = req.params.u_id;
  res.status(200).render("recipes", { userID: userID });
});

// export the router
module.exports = router;
