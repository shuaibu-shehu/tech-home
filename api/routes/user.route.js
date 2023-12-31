const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const { verifyToken } = require("../utils/verifyToken.js");
const { updateProfile,deleteUser , getUserListings, getUser} = require("../controllers/user.controller.js");


router.post("/update/:id",verifyToken,updateProfile);
router.delete("/delete/:id",verifyToken,deleteUser);
router.get('/listings/:id',verifyToken,getUserListings);
router.get('/:id',verifyToken,getUser)


module.exports = router;
 