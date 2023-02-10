var express = require("express");
var router = express.Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const mongoose = require("mongoose");

/* GET users listing. */
router.get("/signup", function (req, res, next) {
  res.render("users/signup.hbs");
});

router.post("/signup", function (req, res, next) {
  console.log("The form data: ", req.body);

  const { fullName, email, password } = req.body;
  // our own validation , if we comment this out we get same but the built in errors from mongoose.
  if (!fullName || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({
        fullName,
        email,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/users/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("users/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("users/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});
router.get("/login", function (req, res, next) {
  res.render("users/login.hbs");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // we can do  if password === "", same as saying false so we can use !password
  if (!email || !password) {
    res.render("users/login.hbs", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("users/login.hbs", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect("/");
      } else {
        res.render("users/login.hbs", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
