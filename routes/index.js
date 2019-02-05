var express    = require("express"),
    Campground = require ("../models/campground"),
    Comment    = require ("../models/comment"),
    User       = require ("../models/user"),
    passport   = require("passport"),
    router     = express.Router();
    

// Root Route (home page)
router.get("/", function(req, res){
    res.render("landing");
});

// render sign up template
router.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// render login form 
router.get("/login", function(req, res){
    res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
     }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;
