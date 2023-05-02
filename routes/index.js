let express = require("express");
let router = express.Router();
let indexController = require("../controllers/indexController");

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
/* GET home page. */
router.get("/join", indexController.join_get);
router.post("/join", indexController.join_post);
router.get("/login", indexController.login_get);
router.post("/login", indexController.login_post);
router.get("/signup", indexController.signup_get);
router.post("/signup", indexController.signup_post);
router.post("/message", indexController.message_post);
router.get("/logout", indexController.logout_get);
router.get("/", indexController.index);

module.exports = router;
