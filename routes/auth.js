var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    res.render("welcome");
});

router.get("/signup", function(req, res) {
    res.render("signup");
});


router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/signup", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/signup");
        }
        else {

            var message = "User " + req.body.username + " successfully signed up";

            passport.authenticate("local")(req, res, function() {
                req.flash("success", message);
                res.redirect("/campgrounds");
            });

        }
    });
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: 'Welcome to YelpCamp',
        failureFlash: 'Error while logging in. Please try again.'
    }),
    function(req, res) {

    });

router.get("/logout", middleware.isLoggedIn, function(req, res) {
    var message = "Bye " + req.user.username + ". You are successfully logged out.";
    req.logout();
    req.flash("success", message);
    res.redirect("/");
});

module.exports = router;
