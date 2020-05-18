const express = require("express");

// create new router tp handle requests
const router = express.Router();

// define routes
router.get("/", (req, res, next) => {
  res.status(200).render("home");
});

// export the router
module.exports = router;
