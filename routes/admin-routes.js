const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controller");
const isAdmin = require("../middleware/is-admin");


const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/img/courses");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
//admin course mangement
router.get("/courses", isAdmin, adminController.getAdminCourses);

router.get("/create-course", isAdmin, adminController.getCreateCourse);
router.post(
  "/create-course",
  isAdmin,
  upload.single("image"),
  adminController.postCreateCourse
);

router.get("/:id/edit", isAdmin, adminController.getEditCourse);
router.post(
  "/:id/edit",
  isAdmin,
  upload.single("image"),
  adminController.postEditCourse
);

router.post("/:id/delete", isAdmin, adminController.postDeleteCourse);

module.exports = router;
