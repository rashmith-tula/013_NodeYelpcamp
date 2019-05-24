var middlewareObj = {};
var Camp = require("../models/camp");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "You need to login to proceed with this.");
    res.redirect("/login");
};

middlewareObj.checkCampOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, function(err, foundCamp) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            }
            else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    req.flash("error", "You are not authorized for this.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to login to proceed with this.");
        res.redirect("/login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You are not authorized for this.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to login to proceed with this.");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;
