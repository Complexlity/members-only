const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
require("dotenv").config();

function userValidate() {
  return [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
}

function formatDate(arr) {
  arr.map((item) => {
    item.formattedDate = dayjs(item.createdAt).fromNow();
    return item;
  });
  return arr;
}

exports.index = async function (req, res, next) {
  let messages = [];
  try {
    messages = await Message.find().sort({ createdAt: -1 });

    formatDate(messages);
  } catch (error) {
    next(error);
  }
  res.render("index", {
    title: "Complex Club",
    messages,
    user: req.user || "",
  });
};

exports.join_get = (req, res, next) => {
  res.render("join", { title: "Become A Member" });
};

exports.join_post = [
  body("secret_code")
    .notEmpty()
    .trim()
    .custom((value) => {
      if (value === process.env.SECRET_CODE) {
        return true;
      } else {
        throw new Error();
      }
    }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!req.user) {
      return res.render("join", {
        title: "Become A Member",
        error: "please login to be able to join",
        password: req.body.secret_code,
      });
    }

    if (!errors.isEmpty()) {
      return res.render("join", {
        title: "Become A Member",
        error: "Invalid code. Please get the code first",
        password: req.body.secret_code,
      });
    }

    const user = await User.findOne({ _id: req.user._id });
    user.member = true;
    user.save().then(() => {
      return res.redirect("/");
    });
  },
];

exports.login_get = (req, res, next) => {
  res.render("login", { title: "Log In To Your Account" });
};

exports.login_post = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: true,
  })(req, res, next);
};

exports.signup_get = (req, res, next) => {
  res.render("signup", {
    title: "Create A New Account",
    error: "",
    username: "",
  });
};

exports.signup_post = [
  userValidate(),
  async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(password);

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
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
          res.redirect("/login");
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
  },
];

exports.message_post = [
  body("title", "Title must be less than 50 characters")
    .notEmpty()
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body("message", "Message is required")
    .notEmpty()
    .trim()
    .isLength({ max: 200 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }

    if (req.user) {
      const message = new Message({
        author: req.user.username,
        title: req.body.title,
        body: req.body.message,
      });
      await message.save();
      return res.redirect("/");
    }
    return res.status(400).json({ message: "User not found" });
  },
];

exports.logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.code_get = (req, res, next) => {
  const SECRET_CODE = process.env.SECRET_CODE;
  if (req.user) {
    res.status(200).json({
      SECRET_CODE,
    });
  } else {
    res.render("join", {
      title: "Become A Member",
      error: "please login to be able to join",
    });
  }
};
