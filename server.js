require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

app.use(cors());

require("../server/config/passport.config");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res) {
  res.redirect("login");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/login/facebook", passport.authenticate("facebook"));

app.get(
  "/return",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/profile");
  }
);

app.get("/profile", require("connect-ensure-login").ensureLoggedIn(), function(
  req,
  res
) {
  res.render("profile", { user: req.user });
});

app.listen(process.env["PORT"], () => {
  console.log(`Server listening on port ${process.env["PORT"]}!`);
});
