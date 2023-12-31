const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken.js");
const { createListing, deleteListing, updateListing } = require("../controllers/listing.controller.js");

router.post("/create",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deleteListing);
router.post("/update/:id",verifyToken,updateListing);

module.exports = router;