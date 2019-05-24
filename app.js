var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    Camp = require("./models/camp"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    passport = require("passport"),
    psptlocl = require("passport-local"),
    eSession = require("express-session"),
    mOverride = require("method-override");

var campgrounds = require("./routes/campgrounds"),
    comments = require("./routes/comments"),
    auth = require("./routes/auth");

mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(eSession({ secret: "Hare Krishna Hare Rama", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(mOverride("_method"));
passport.use(new psptlocl(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/comments", comments);
app.use(auth);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running Yelpcamp App");
});
