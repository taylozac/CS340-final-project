// Module imports
const express = require("express");
const mysql = require("./dbcon.js");
const hbs = require("handlebars");
const exphbs = require("express-handlebars");
const path = require("path");

// router imports
const indexRouter = require("./routes/indexRouter");
const recipeRouter = require("./routes/reciperRouter");

// create new instance of express app and set port
const app = express();
const port = process.env.port || 3000;
// app.set("port", process.argv[2]); -- may need to change back to this later

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

/*
    App Routing -  connect routers the app
*/
app.use("/", indexRouter);
app.use("/recipes", recipeRouter);

// set function to respond to any unhandled GET request
app.get("*", (req, res, next) => {
  res.status(404).render("404");
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
