const express = require("express");
const router = express.Router();
const externalController = require("../controllers/externalapi-controller");

router.get("/", externalController.getDogImages);

module.exports = router;
