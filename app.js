var express        = require("express"),
    app            = express(), 
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user");
    // seedDB        = require("./seeds");
    
var commentRoutes    = require("./routes/campgrounds"),
    campgroundRoutes = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
    
    
// App configuration
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

// Passport Configuration
app.use(require("express-session")({
    secret: "Cal wins the best dog award",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(campgroundRoutes)
app.use(commentRoutes);
app.use(indexRoutes);

// Server listener
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});