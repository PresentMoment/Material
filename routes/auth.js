const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ArtWork = require("../models/ArtWork");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/add", (req, res, next) => {
  res.render("auth/add", { "message": req.flash("error"), user: req.user });
});

router.post("/add", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/add",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error"), user: req.user });
});

router.get('/favorites', (req, res, next) => {
  User.findOne({ _id: req.user.id })
  .populate( 'favorites' )
  .then(user => {
    console.log(user.favorites)
    res.render('auth/favorites',{ arts: user.favorites, user: req.user });
  })
    });
//   res.render('auth/favorites')
// });

router.post("/favorites/:id", (req, res) => {
  ArtWork.findOne({_id:req.params.id}).then(artwork=>{

    User.findByIdAndUpdate(req.user._id,
    {$addToSet: {favorites: artwork._id}},{new:true}
    )
    .then((data) => {
      res.redirect('/auth/favorites')
    })
  })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password", user: req.user });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
});



module.exports = router;