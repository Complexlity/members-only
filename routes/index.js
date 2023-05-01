let express = require("express");
let router = express.Router();

/* GET home page. */
router.get("/join", (req, res, next) => {
  res.render("join", { title: "Join The Club" });
});
router.get("/login", (req, res, next) => {
  res.render("login", { title: "Log In To Your Account" });
});
router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Create A New Account" });
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Complex Club" });
});

module.exports = router;
