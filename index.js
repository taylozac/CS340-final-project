// Module imports
const express = require("express");
const mysql = require("./dbcon.js");
const hbs = require("handlebars");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

// router imports
const indexRouter = require("./routes/indexRouter");
const recipeRouter = require("./routes/reciperRouter");
const supplierRouter = require("./routes/supplierRouter");

// create new instance of express app and set port
const app = express();
const port = process.argv[2] || 3000;
app.set("port", port);

// ste body parser setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
  Set up templating engine
*/
//use handlebars as templating engine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "handlebars");

// look for all static files in the "static" directory
app.use(express.static(path.join(__dirname, "static")));

/*
    logging function so that requests can be visualized
*/
function logger(req, res, next) {
  console.log("Request:", "--Method:", req.method, "--URL:", req.url);
  next();
}
//set app to use the logger
app.use(logger);

// APPLY COOKIE SESSION MIDDLEWARE
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 3600 * 1000, // 1hr
  })
);

/*
    App Routing -  connect routers the app
*/
app.use("/", indexRouter);
app.use("/recipes", recipeRouter);
app.use("/supplier", supplierRouter);

// set function to respond to any unhandled GET request
app.get("*", (req, res, next) => {
  res.status(404).render("error", {
    css: ["error.css"],
    status: 404,
    message: "Page could not be found!",
  });
});

// set function to handle other errors that occur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500");
});

// set app to listen for requests at port
app.listen(port, () => {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
