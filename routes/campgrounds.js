var express    = require("express"),
    Campground = require ("../models/campground"),
    Comment    = require ("../models/comment"),
    User       = require ("../models/user"),
    router     = express.Router(),
    middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
          res.render("campground/index", {campgrounds: allCampgrounds, currentUser: req.user});  
        }
    });
});

// CREATE - add new campgrounds to DB
router.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
        // create new campground and save it to the DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
              console.log(err);  
            } else {
               res.redirect("/campgrounds");
            }
    });
});

// NEW - show form to create new campground 
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
   res.render("campground/new") 
});

// SHOW - shows more info about one campground 
router.get("/campgrounds/:id", function(req, res){
    // find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // render the show template with that campground
            res.render("campground/show", {campground: foundCampground});
        }
    });
});

// EDIT - Allows the user to edit campground info
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function (req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("./campground/edit", {campground: foundCampground});
    });
});

// UPDATE campground
router.put("/campgrounds/:id", function(req, res){
    // find an update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampround){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY camoground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
