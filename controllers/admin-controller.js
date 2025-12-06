const Course = require("../models/course-model");
const Trainer = require("../models/trainer-model");
const User = require("../models/user-model");

// ======================================================
// ADMIN: VIEW ALL COURSES
// ======================================================
exports.getAdminCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("trainer");

    res.render("admin/courses", {
      pageTitle: "Manage Courses",
      pageClass: "admin-course-list",
      courses
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ADMIN: SHOW CREATE COURSE FORM
// ======================================================
exports.getCreateCourse = async (req, res, next) => {
  try {
    const trainers = await Trainer.find();

    res.render("admin/create-course", {
      pageTitle: "Create Course",
      pageClass: "create-course-page",
      trainers
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ADMIN: CREATE COURSE
// ======================================================
exports.postCreateCourse = async (req, res, next) => {
  try {
    const { title, summary, description, price, capacity, trainer, schedule } =
      req.body;

    if (!req.file) {
      return res.status(400).render("admin/create-course", {
        pageTitle: "Create Course",
        pageClass: "create-course-page",
        errorMessage: "Image upload is required.",
      });
    }

    await Course.create({
      title,
      summary,
      description,
      price: Number(price),
      capacity: Number(capacity),
      trainer,
      schedule,
      image: "/assets/img/courses/" + req.file.filename,
    });

    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ADMIN: SHOW EDIT COURSE FORM
// ======================================================
exports.getEditCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    const trainers = await Trainer.find();

    if (!course) return res.status(404).render("404");

    res.render("admin/edit-course", {
      pageTitle: "Edit Course",
      pageClass: "admin-page",
      course,
      trainers,
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ADMIN: EDIT COURSE
// ======================================================
exports.postEditCourse = async (req, res, next) => {
  try {
    const { title, summary, description, price, capacity, trainer, schedule } =
      req.body;

    const course = await Course.findById(req.params.id);
    if (!course) return res.redirect("/admin/courses");

    course.title = title;
    course.summary = summary;
    course.description = description;
    course.price = Number(price);
    course.capacity = Number(capacity);
    course.trainer = trainer;
    course.schedule = schedule;

    if (req.file) {
      course.image = "/assets/img/courses/" + req.file.filename;
    }

    await course.save();

    res.redirect("/admin/courses");
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ADMIN: DELETE COURSE
// ======================================================
exports.postDeleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.redirect("/admin/courses");

    // Remove course from all users who registered
    await User.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    await Course.findByIdAndDelete(courseId);

    res.redirect("/admin/courses");
  } catch (err) {
    next(err);
  }
};
