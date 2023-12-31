const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken.js");
const { createListing, deleteListing } = require("../controllers/listing.controller.js");

router.post("/create",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deleteListing);

module.exports = router;