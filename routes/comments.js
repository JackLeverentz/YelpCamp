var express    = require("express"),
    Campground = require ("../models/campground"),
    Comment    = require ("../models/comment"),
    User       = require ("../models/user"),
    middleware = require("../middleware"),
    router     = express.Router();
    

// CREATE a comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // Find campground by Id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});


router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    // Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            // Create new comment
            Comment.create(req.body.comment, function (err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                        //save comment
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                // redirect to campground show page
                res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT Comment
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
        }
    });
});

// UPDATE Comment after user has made edits 
router.put("/campgrounds/:id/comments/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY comment
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted!");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});
   
module.exports = router;
