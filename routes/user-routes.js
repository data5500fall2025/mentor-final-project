const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");



// Show signup form
router.get("/signup", userController.getSignup);

// Handle signup
router.post("/signup", userController.postSignup);

// Show login form
router.get("/login", userController.getLogin);

// Handle login
router.post("/login", userController.postLogin);

// Logout
router.get("/logout", userController.logout);


router.get("/my-courses", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}, userController.getMyCourses);

module.exports = router;

