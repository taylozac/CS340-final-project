// DECLARING CUSTOM MIDDLEWARE

// if user is not logged in, redirect to login page
const ifNotLoggedin = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(200).render("login", { css: ["login.css"] });
  }
  next();
};

// if user is logged in, redirect to home page
const ifLoggedin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home");
  }
  next();
};

// if trying to access suppler page, confirm that they are supplier
const ifNotSupplier = (req, res, next) => {};
// END OF CUSTOM MIDDLEWARE

exports.ifNotLoggedin = ifNotLoggedin;
exports.ifLoggedin = ifLoggedin;
exports.ifNotSupplier = ifNotSupplier;
