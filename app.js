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
app.use(require("express-session")({
  secret: "I am the secret!",
  resave: false,
  saveUninitialized: false
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());


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



app.listen(3000, function() {
  console.log("Auth server started!");
});
