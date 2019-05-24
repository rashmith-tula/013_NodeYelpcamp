var express = require("express");
var router = express.Router({ mergeParams: true });
var Camp = require("../models/camp");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Camp.findById(req.params.id, function(err, camp) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            res.render("comments/new", { camp: camp });
        }
    });
});


router.post("/", middleware.isLoggedIn, function(req, res) {
    Camp.findById(req.params.id, function(err, camp) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", err.message);
                }
                else {
                    req.flash("success", "Comment successfully posted");
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // camp.comments.splice(1, 6);
                    camp.comments.push(comment._id);
                    camp.save();
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
});


router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            Camp.findById(req.params.id, function(err1, foundCamp) {
                if (err1) {
                    res.redirect("back");
                }
                else {
                    res.render("comments/edit", { camp: foundCamp, comment: foundComment });
                }
            })

        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment successfully updated");
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
