const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken.js");
const { createListing } = require("../controllers/listing.controller.js");

router.post("/create",verifyToken,createListing);

module.exports = router;