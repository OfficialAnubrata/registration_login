const express = require("express");
const { registerUser, loginUser, currentUserInfo } = require("../controllers/user.controller");
const validateToken  = require("../middleware/auth.middleware.js");



const router = express.Router();

router.post("/register", registerUser)
router.post("/login",loginUser)
router.get("/userinfo",validateToken,currentUserInfo)

module.exports = router;