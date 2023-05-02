const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
require("../auth");

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
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
};

exports.signup_get = (req, res, next) => {
  res.render("signup", { title: "Create A New Account" });
};

exports.signup_post = async (req, res, next) => {
  const password = req.body.password;
  console.log(password);

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    } else {
      console.log({ hashedPassword });

      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        const result = await user.save();
        console.log("User saved");
        res.redirect("/");
      } catch (error) {
        return next(err);
      }
    }
  });
};

exports.message_post = (req, res, next) => {
  console.log(req.body);

  const messageTitle = req.body.title;
  const message = req.body.message;
  console.log({ messageTitle, message });
  console.log(user);

  res.json({ title: "Message Post" });
};

exports.logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
};
