// AUTHENTICATION CHECK
exports.verifyAuth = (req, res, next) => {
  if (!req.session.user) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/auth/login");
  }
  next();
};

// ADMIN CHECK
exports.verifyAdmin = (req, res, next) => {
  if (
    !req.session.user ||
    !req.session.user.roles ||
    !req.session.user.roles.includes("admin")
  ) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/auth/login");
  }
  next();
};
