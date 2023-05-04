const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body } = require("express-validator");

function userValidate() {}

exports.index = function (req, res, next) {
  const messages = [];
  res.render("index", {
    title: "Complex Club",
    messages,
    user: req.user || "",
  });
};

exports.join_get = (req, res, next) => {
  res.render("join", { title: "Join The Club" });
};

exports.join_post = (req, res, next) => {
  res.json({ title: "Join Post" });
};

exports.login_get = (req, res, next) => {
  res.render("login", { title: "Log In To Your Account" });
};

exports.login_post = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
  })(req, res, next);
};

exports.signup_get = (req, res, next) => {
  res.render("signup", {
    title: "Create A New Account",
    error: "",
    username: "",
  });
};

exports.signup_post = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(password);

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      console.log("First Error");
      console.log(err);

      return next(err);
    } else {
      console.log({ hashedPassword });

      try {
        const user = new User({
          username,
          password: hashedPassword,
        });
        const result = await user.save();
        console.log("User saved");
        res.redirect("/");
      } catch (error) {
        if (error.code === 11000) {
          return res.render("signup", {
            title: "Sign Up",
            error: "Username already taken. Please try another",
            username,
          });
        }
        return next(error);
      }
    }
  });
};

exports.message_post = (req, res, next) => {
  res.json({ currentUser: res.locals.currentUser });
};

exports.logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
};
