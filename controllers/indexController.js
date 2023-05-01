const Message = require("../models/messageSchema");

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

exports.signup_post = (req, res, next) => {
  res.json({ title: "SignUp Post" });
};

exports.message_post = (req, res, next) => {
  res.json({ title: "Message Post" });
};
