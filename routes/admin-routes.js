const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Admin router is working.");
});


const adminController = require("../controllers/admin-controller");
const contactController = require("../controllers/contact-controller");
const isAdmin = require("../middleware/is-admin");

const multer = require("multer");
const path = require("path");

// ===== Multer Config =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/img/courses");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.get("/courses", isAdmin, adminController.getAdminCourses);

router.get("/create-course", isAdmin, adminController.getCreateCourse);
router.post(
  "/courses/create",
  isAdmin,
  upload.single("image"),
  adminController.postCreateCourse
);

router.get("/courses/:id/edit", isAdmin, adminController.getEditCourse);
router.post(
  "/courses/:id/edit",
  isAdmin,
  upload.single("image"),
  adminController.postEditCourse
);

router.post("/courses/:id/delete", isAdmin, adminController.postDeleteCourse);

// ===============================
// ADMIN CONTACT RESPONSE ROUTES
// ===============================
router.get("/contacts/respond", isAdmin, contactController.getContactsWithNoResponse);

router.get("/contacts/respond/:id", isAdmin, contactController.getContactResponseForm);

router.post("/contacts/respond/:id", isAdmin, contactController.postContactResponse);

module.exports = router;
