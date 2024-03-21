const User = require("../models/user");


module.exports.renderSignup = (req, res) => {
    res.render("../views/users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });

      await User.register(newUser, password);
      req.login(newUser, (err)=>{
        if(err){
          return next(err);
        }
        else{
          req.flash("success", "Welcome to Food-Match!");
          res.redirect("/listings");
        }
      })
      
    } catch (e) {
      req.flash("success", e.message);
      res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("../views/users/login.ejs");
};

module.exports.loggedIn = async (req, res) => {
    req.flash("success", "Welcome Back to Food-Match !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.loggedOut = (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "You are Logged Out!");
        res.redirect("./listings");
      }
    });
};