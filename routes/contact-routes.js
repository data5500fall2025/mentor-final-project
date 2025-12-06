const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contact-controller");

router.get("/", contactController.getContact);
router.get("/new", contactController.getContact);  
router.post("/", contactController.postContact);
router.get("/thanks", contactController.getThanks);

module.exports = router;
