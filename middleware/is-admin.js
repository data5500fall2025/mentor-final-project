module.exports = (req, res, next) => {
  if (!req.session.user || !req.session.user.roles.includes("admin")) {
    return res.status(403).render("403", {
      pageTitle: "Forbidden",
      pageClass: "error-page"
    });
  }
  next();
};

