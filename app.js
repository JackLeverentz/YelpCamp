var express          = require("express"),
    app              = express(), 
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    methodOverride   = require("method-override"),
    flash            = require("connect-flash"),
    LocalStrategy    = require("passport-local"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    commentRoutes    = require("./routes/campgrounds"),
    campgroundRoutes = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
    // seedDB        = require("./seeds");
    
// local MongoDB configuration 
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});  

// App configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); 

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


// Flash and global user configuation
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes config
app.use(campgroundRoutes)
app.use(commentRoutes);
app.use(indexRoutes);

// Local server listener 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});