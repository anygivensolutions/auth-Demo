var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

//app config
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/authDemo", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
  secret: "I am the secret!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=====routes======
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/secret", function(req, res) {
  res.render("secret");
});

//=====Auth routes =====

  //sign up form
app.get("/register", function(req, res) {
  res.render("register");
});


  //handling user sign up
app.post("/register", function(req, res) {
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err) {
      consoel.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req,res, function() {
        res.redirect("/secret");
      });
    }
  });
});

  //login Routes
app.get("/login", function(req, res) {
  res.render("login");
});

  //login logic
  app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }), function(req, res) {

  });

app.listen(3000, function() {
  console.log("Auth server started!");
});
