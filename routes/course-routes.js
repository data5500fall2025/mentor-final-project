const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course-controller");


// List all courses 
router.get("/", courseController.getCourses);

// Course details by slug
router.get("/:slug", courseController.getCourseDetails);

module.exports = router;
