const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contact-controller");

// PUBLIC ROUTES
router.get("/", contactController.getContact);
router.post("/", contactController.postContact);
router.get("/thanks", contactController.getThanks);

module.exports = router;
