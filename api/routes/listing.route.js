const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken.js");
const { createListing, deleteListing, updateListing, getListing , getListings} = require("../controllers/listing.controller.js");

router.post("/create",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deleteListing);
router.post("/update/:id",verifyToken,updateListing);
router.get('/get/:id',getListing)
router.get('/get',getListings)

module.exports = router;