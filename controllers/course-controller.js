const Course = require("../models/course-model");
const Trainer = require("../models/trainer-model");
const User = require("../models/user-model");


exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("trainer");

    res.render("courses", {
      pageTitle: "Courses",
      pageClass: "courses-page",
      courses,
    });
  } catch (err) {
    next(err);
  }
};


exports.getCourseDetails = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const course = await Course.findOne({ slug }).populate("trainer");

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
        pageClass: "error-page",
      });
    }

    const sessionUser = req.session.user;
    let isRegistered = false;

    if (sessionUser) {
      isRegistered = sessionUser.courses?.includes(course._id.toString());
    }

    const availableSeats = course.capacity - course.registrants.length;

    res.render("course-details", {
      pageTitle: "Course Details",
      pageClass: "course-details-page",
      course,
      isRegistered,
      availableSeats,
    });
  } catch (err) {
    next(err);
  }
};


exports.getTopCoursesByLikes = async (limit) => {
  try {
    return await Course.find()
      .sort({ likes: -1 })
      .limit(limit)
      .populate("trainer");
  } catch (err) {
    console.error("Top courses error:", err);
    return [];
  }
};


exports.getRegisterForm = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    const courses = await Course.find().sort({ title: 1 });

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
        pageClass: "error-page",
      });
    }

    res.render("register-course", {
      pageTitle: "Register for Course",
      pageClass: "register-page",
      selectedCourse: course,
      courses,
    });
  } catch (err) {
    next(err);
  }
};


exports.postRegister = async (req, res, next) => {
  try {
    const courseId = req.body.course;
    const userId = req.session.user._id;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.redirect("/courses");
    }

    // Prevent duplicate registrations
    if (user.courses.includes(course._id)) {
      return res.redirect(`/courses/${course.slug}`);
    }

    // Capacity check
    if (course.registrants.length >= course.capacity) {
      return res.redirect(`/courses/${course.slug}`);
    }

    user.courses.push(course._id);
    course.registrants.push(user._id);

    await user.save();
    await course.save();

    // Sync session
    req.session.user.courses = user.courses;
    req.session.save();

    res.redirect(`/courses/${course.slug}`);
  } catch (err) {
    next(err);
  }
};


exports.postUnregister = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.session.user._id;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.redirect("/courses");
    }

    user.courses = user.courses.filter((id) => id.toString() !== courseId);
    course.registrants = course.registrants.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await course.save();

    req.session.user.courses = user.courses;
    req.session.save();

    res.redirect(`/courses/${course.slug}`);
  } catch (err) {
    next(err);
  }
};


exports.getCreateCourse = async (req, res, next) => {
  try {
    const trainers = await Trainer.find();

    res.render("admin/create-course", {
      pageTitle: "Create Course",
      pageClass: "create-course-page",
      trainers,
    });
  } catch (err) {
    next(err);
  }
};

exports.postCreateCourse = async (req, res, next) => {
  try {
    const { title, summary, description, price, capacity, trainer, schedule } =
      req.body;

    if (!req.file) {
      return res.status(400).send("Image upload required.");
    }

    await Course.create({
      title,
      summary,
      description,
      price,
      capacity,
      trainer,
      schedule,
      image: `/assets/img/courses/${req.file.filename}`,
    });

    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};


exports.getEditCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    const trainers = await Trainer.find();

    if (!course) {
      return res.status(404).render("404");
    }

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

exports.postEditCourse = async (req, res, next) => {
  try {
    const { title, summary, description, price, capacity, trainer, schedule } =
      req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.redirect("/courses");
    }

    course.title = title;
    course.summary = summary;
    course.description = description;
    course.price = price;
    course.capacity = capacity;
    course.trainer = trainer;
    course.schedule = schedule;

    if (req.file) {
      course.image = `/assets/img/courses/${req.file.filename}`;
    }

    await course.save();

    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};


exports.postDeleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.redirect("/courses");
    }

    // Remove from all users’ registered courses
    await User.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    await Course.findByIdAndDelete(req.params.id);

    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};
