const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

exports.index = function (req, res, next) {
  const messages = [];
  res.render("index", { title: "Complex Club", messages });
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
  res.json({ title: "Login Post" });
};

exports.signup_get = (req, res, next) => {
  res.render("signup", { title: "Create A New Account" });
};

exports.signup_post = async (req, res, next) => {
  const password = req.body.password;
  console.log(password);

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      console.log("I errored 1");

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
        console.log("I errored 2");

        return next(err);
      }
    }
  });
};

exports.message_post = (req, res, next) => {
  res.json({ title: "Message Post" });
};
