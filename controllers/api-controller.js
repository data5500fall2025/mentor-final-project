const Course = require("../models/course-model");
const jwt = require("jsonwebtoken");

// SECRET KEY 
const JWT_SECRET = "supersecretjwttoken123";


// GET TOKEN

exports.getToken = (req, res) => {
  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, // 24 hours
    JWT_SECRET
  );
  res.json({ token });
};


// VERIFY TOKEN

exports.verifyToken = (req, res, next) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.log("TOKEN VERIFY ERROR:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


// GET COURSES AS API JSON

exports.getCourses = async (req, res) => {
  try {
    let courses = await Course.find().select("-registrants");

    // Build full image URL
    courses = courses.map((course) => ({
      ...course.toObject(),
      image: `http://localhost:3000${course.image}`,
    }));

    res.json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};
