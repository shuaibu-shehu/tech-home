const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const { signup, signin, google, signout } = require("../controllers/auth.controller.js");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google",google);
router.get("/signout",signout)

module.exports = router;
