const bcrypt = require("bcryptjs");
const User = require("../models/user-model");
const Course = require("../models/course-model");

// =========================
// SHOW SIGNUP FORM
// =========================
exports.getSignup = (req, res, next) => {
  try {
    return res.render("signup", {
      pageTitle: "Sign Up",
      pageClass: "signup-page",
      errorMessage: null,
      formData: {}
    });
  } catch (err) {
    return next(err);
  }
};

// =========================
// HANDLE SIGNUP
// =========================
exports.postSignup = async (req, res, next) => {
  console.log("🔥 SIGNUP POST ROUTE HIT");

  const { firstName, lastName, email, password, confirm_password } = req.body;

  try {
    // Passwords must match
    if (password !== confirm_password) {
      return res.render("signup", {
        pageTitle: "Sign Up",
        pageClass: "signup-page",
        errorMessage: "Passwords do not match.",
        formData: req.body
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("signup", {
        pageTitle: "Sign Up",
        pageClass: "signup-page",
        errorMessage: "An account with that email already exists.",
        formData: req.body
      });
    }

    // Create user (password hashing handled by pre-save hook)
    await User.create({
      firstName,
      lastName,
      email,
      password,
      roles: ["user"],
      courses: []
    });

    return res.redirect("/auth/login");

  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    return next(err);
  }
};

// =========================
// SHOW LOGIN FORM
// =========================
exports.getLogin = (req, res, next) => {
  try {
    return res.render("login", {
      pageTitle: "Login",
      pageClass: "login-page",
      errorMessage: null,
      formData: {}
    });
  } catch (err) {
    return next(err);
  }
};

// =========================
// HANDLE LOGIN
// =========================
exports.postLogin = async (req, res, next) => {
  console.log("LOGIN ROUTE HIT");

  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        pageTitle: "Login",
        pageClass: "login-page",
        errorMessage: "Invalid email or password.",
        formData: { email }
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("LOGIN isMatch:", isMatch);

    if (!isMatch) {
      return res.render("login", {
        pageTitle: "Login",
        pageClass: "login-page",
        errorMessage: "Invalid email or password.",
        formData: { email }
      });
    }

    // SUCCESSFUL LOGIN
    req.session.user = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      courses: user.courses
    };

    req.session.flashMessage = `Welcome, ${user.firstName}!`;

    return req.session.save(() => {
      return res.redirect("/");
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    return next(err);
  }
};

// =========================
// LOGOUT
// =========================
exports.logout = (req, res, next) => {
  try {
    req.session.destroy(() => {
      return res.redirect("/");
    });
  } catch (err) {
    return next(err);
  }
};

// =========================
// STEP 9: MY COURSES PAGE
// =========================
exports.getMyCourses = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.redirect("/auth/login");
    }

    // Populate the user's courses
    const user = await User.findById(userId).populate("courses");

    if (!user) {
      return res.redirect("/auth/login");
    }

    return res.render("my-courses", {
      pageTitle: "My Courses",
      pageClass: "my-courses-page",
      courses: user.courses
    });

  } catch (err) {
    return next(err);
  }
};
