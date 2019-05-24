var express = require("express");
var router = express.Router();
var Camp = require("../models/camp");
var middleware = require("../middleware");

// INDEX
router.get("/", function(req, res) {
    Camp.find({}, function(err, camps) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            res.render("index", { camps: camps });
        }
    });
});


// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("new");
});


//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = { id: req.user._id, username: req.user.username };
    var camp = { name: name, image: image, description: desc, price: price, author: author };
    Camp.create(camp, function(err, camp) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            req.flash("success", "Campground successfully created.");
            res.redirect("/campgrounds");
        }
    });
});


router.get("/:id", function(req, res) {
    var campId = req.params.id;
    Camp.findById(campId).populate("comments").exec(function(err, foundCamp) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            res.render("show", { camp: foundCamp });
        }
    });
});

router.get("/:id/edit", middleware.checkCampOwnership, function(req, res) {
    Camp.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/edit", { camp: foundCamp });
        }
    });
});

router.put("/:id", middleware.checkCampOwnership, function(req, res) {
    Camp.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Campground successfully updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id/", middleware.checkCampOwnership, function(req, res) {
    Camp.findByIdAndRemove(req.params.id, function(err, deletedCamp) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds/" + req.params.id);
        }
        else {
            var message = "Campground " + deletedCamp.name + " deleted successfully"
            req.flash("success", message);
            res.redirect("/campgrounds/");
        }
    });
});

module.exports = router;
