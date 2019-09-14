var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  PassportLocalMongoose = require("passport-local-mongoose"),
  session = require("express-session"),
  cookieParser = require("cookie-parser"),
  ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

var app = express();
app.set("view engine", "ejs");
//mongoose settings
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useCreateIndex", true);

//mongoose.connect("mongodb://localhost/qolab_app", { useNewUrlParser: true });
mongoose.connect(
  "mongodb+srv://sarvesh99fin:Samarth@2003@qolab-o5r9b.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser());
// LOCAL-PASSPORT-LOGIN-TRADITIONAL
app.use(
  require("express-session")({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

//==============================================================================
//   ROUTES
//==============================================================================
// "/" ==> "Home_Page"
app.get("/", function(req, res) {
  res.render("home");
});
// Auth Routes (Sign-Up and Login)
// "/register"==> "Sign-Up"
app.get("/register", function(req, res) {
  res.render("register");
});
//handling Sing-Up function
app.post("/register", function(req, res) {
  req.body.username;
  req.body.password;
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/dashboard");
      });
    }
  );
});
// "/login"==> "Login"
app.get("/login", function(req, res) {
  res.render("login");
});
// Login Logic
// Middleware
app.post(
  "/login",
  passport.authenticate(["local"], {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);
/*
app.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/auth/google/callback', 
  passport.authenticate('google', {
	failureRedirect: "/login"}),
  function(req, res) {
});*/
// "/dashboard"==> "Dashboard/Landing"
app.get("/dashboard", isLoggedIn, function(req, res) {
  res.render("dashboard");
});
// Logout logic
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

// Login check function==> can be called in routes
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
// No idea

// Ideation page==>Live Contests
app.get("/ideation", function(req, res) {
  res.render("ideation");
});
app.get("/lounge", function(req, res) {
  res.render("lounge");
});
app.get("/contact", function(req, res) {
  res.render("contact");
});
app.get("/resources", function(req, res) {
  res.render("resources");
});
app.get("/community", function(req, res) {
  res.render("community");
});
// Profile Page for every user :
app.get(
  "/profile",
  /*isLoggedIn,*/ function(req, res) {
    res.render("profile");
  }
);
// FAQ page
app.get("/frequently_asked_questions", function(req, res) {
  res.render("frequently_asked_questions");
});
// About Us page==>about n team
app.get("/about", function(req, res) {
  res.render("about");
});

app.get("*", function(req, res) {
  res.render("home");
});

/* app.listen(process.env.PORT, process.env.IP, function(){ */
app.listen(5000, function() {
  console.log("QOLAB server has started~!");
});
