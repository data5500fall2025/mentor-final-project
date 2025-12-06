const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contact-controller");
const isAdmin = require("../middleware/is-admin");

// PUBLIC CONTACT ROUTES
router.get("/", contactController.getContact);
router.post("/", contactController.postContact);
router.get("/thanks", contactController.getThanks);



// List all contacts needing response
router.get("/respond", isAdmin, contactController.getContactsWithNoResponse);

// Show form to respond to a single contact
router.get("/respond/:id", isAdmin, contactController.getContactResponseForm);

// Save the response
router.post("/respond/:id", isAdmin, contactController.postContactResponse);

module.exports = router;
