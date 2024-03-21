const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(userController.signup);

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loggedIn
  );

router.get("/logout", userController.loggedOut);

module.exports = router;
