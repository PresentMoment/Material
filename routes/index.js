const express = require('express');
const uploadCloud = require('../config/cloudinary.js');
const router  = express.Router();
const ArtWork = require("../models/ArtWork");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const geo = require('mapbox-geocoding');
geo.setAccessToken('pk.eyJ1IjoicHJlc2VudG1vbWVudCIsImEiOiJjanhpdGlhczkwNWdpM3dwbHRtMGVrdWYwIn0.xzwCmqIxkr_AfZ3YNBwy9g');


/* GET home page */
router.get('/', (req, res, next) => {
  const page = Number(req.query.page) || 1
  const itemsPerPage = 5
  ArtWork.find()
  .collation({locale: "en" })
  .sort ({ title: 1})
  .skip((page - 1) * itemsPerPage)
  .limit(itemsPerPage)
  .then(arts=>{
    ArtWork.countDocuments().then(count => {
      console.log(count / 5)
      console.log(page)
      if ( page < (count / 5)) {
        res.render('index',{arts,user:req.user, nextPage : page + 1, prevPage : page - 1 });
      } else {
        res.render('index',{arts,user:req.user, prevPage : page - 1 })
      }
    })
  })
});


router.get('/error', (req, res) => {
    res.render('error');
  });

router.get("/sculpture/:id", (req, res) => {
  let artistId = req.params.id;
  ArtWork.findOne({'_id': artistId})
  .populate("postedBy")
  // ArtWork.findById(req.params.id)
  // ArtWork.find()
  .then(arts => {
    // console.log(arts)
    res.render('sculpture',{ arts,user:req.user });
  // })
  // .catch(error => {
  //   console.log(error)
  })
});
router.get("/artists/:artist", (req, res) => {
  let artistId = req.params.artist;
  ArtWork.find({'artist': artistId})
  // ArtWork.findById(req.params.id)
  // ArtWork.find()
  .then(arts => {
    res.render('artist',{arts,user:req.user});
  // })
  // .catch(error => {
  //   console.log(error)
  })
});

router.get("/search", (req, res) => {
  ArtWork.find({ $or: [{ artist: new RegExp(req.query.term, "i")},{ title: new RegExp(req.query.term, "i")}, { geoAddress: new RegExp(req.query.term, "i") }] })
  .then(artwork => {
    res.render('index',{arts: artwork, user: req.user });
  })
  
    });

router.get("/api/material", (req, res, next) => {
  ArtWork.find({})
    // .select("location.coordinates") // selects only certain fields
    .sort({ title: 1 }) // sorts by name
    .limit(5) // limits to the first 10 results
    .then(artworks => {
      res.json(artworks);
      // const coordinates = places.map(place => place.location.coordinates)
      // res.json(places)
    });
});

// router.get("/:artworkId", (req, res, next) => {
//   ArtWork.findById(req.params.artworkId)
//   .then(artwork => {
//     res.render("/", { artwork });
//   }) 
//   .catch(err => {
//     console.log("Error while retriving the artworks", err);
//   });
// });

router.post("/artworks", uploadCloud.single('photo'), (req, res, next) => {
  const { artist, title, year, address, needsRepair } = req.body;
  if (!req.file) {
    res.redirect("/error");
  } else {

  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  geo.geocode('mapbox.places', address, function (err, geoData) {

    const newArtWork = new ArtWork({ 
      artist,
      title,
      year,
      address,
      location: {
        formType: "Point",
        coordinates: geoData.features[0].geometry.coordinates,
      },
      geoAddress: geoData.features[0].place_name,
      imgPath,
      imgName,
      postedBy: req.user._id,
      needsRepair,
    })

    ArtWork.findOne({ artist, address, title })
    .then(artwork => {
      if (artwork !== null) {
      res.redirect("/");
      } else {
      ArtWork.create(newArtWork)
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.redirect('/error')
      });
    }
  })
});
  }
});


module.exports = router;