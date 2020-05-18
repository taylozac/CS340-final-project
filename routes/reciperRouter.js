const express = require("express");
const mysql = require("./dbcon.js");

// create new router tp handle requests
const router = express.Router();

// define routes
router.get("/", (req, res, next) => {
  res.status(200).render("recipes");
});

// export the router
module.exports = router;
