module.exports = (req, res, next) => {
  console.log("SESSION USER:", req.session.user);
  next();
};
