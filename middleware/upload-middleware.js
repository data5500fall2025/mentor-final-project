const multer = require("multer");
const path = require("path");

// Where to save uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/img/courses");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safe = base.toLowerCase().replace(/\s+/g, "-");
    cb(null, safe + "-" + Date.now() + ext);
  }
});

// Only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(null, false);
};

module.exports = multer({ storage, fileFilter });
