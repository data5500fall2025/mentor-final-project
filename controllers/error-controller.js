
exports.get404 = (req, res) => {
  return res.status(404).render("404", {
    pageTitle: "404 - Page Not Found",
    pageClass: "error-page",
  });
};


exports.get500 = (err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack || err);

  // Prevent "Can't set headers after they are sent"
  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).render("500", {
    pageTitle: "500 - Server Error",
    pageClass: "error-page",
    errorMessage: err.message || "Something went wrong on the server.",
  });
};
