var express = require("express"),
mongoose = require("mongoose"),
passport = require("passport"),
bodyParser = require("body-parser"),
User = require("./models/user"),
localStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/authdemo", {useMongoClient: true});
mongoose.Promise=global.Promise;
var app = express();
app.set("view engine","ejs");

app.use(require("express-session")({
    secret: "Dheeraj is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES

app.get("/",function(req,res){
    res.render("home");
});
app.get("/secret",isLoggedIn,function (req,res) {
    res.render("secret");
})

//AUTHROUTES

app.get("/register",function(req, res) {
    res.render("register");
})
//register

app.post("/register",function (req,res) {
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register")
        }else{
            passport.authenticate("local")(req,res,function(){
                res.render("secret");
            })
        }
    })
})
//login routes
app.get("/login",function(req, res) {
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function () {
});
//logout
app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});