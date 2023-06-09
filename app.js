// Database file
require("./db/connection");
// Template functions
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// Live Reload Functions
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
// Auth Imports
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportFunctions = require("./auth/passportLocal");
const flash = require("connect-flash");

let indexRouter = require("./routes/index");

let app = express();
// const mongoDB = process.env.MONGODB_CONNECTION_STRING;
// mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, })

// Live Reload Setup
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLiveReload());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Authentication functions
passportFunctions.Setup();
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Middle wares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
