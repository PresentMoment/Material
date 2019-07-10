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
  ArtWork.find().then(arts=>{
    res.render('index',{arts});

  })
});

router.get("/sculpture/:id", (req, res) => {
  let artistId = req.params.id;
  ArtWork.findOne({'_id': artistId})
  // ArtWork.findById(req.params.id)
  // ArtWork.find()
  .then(arts => {
    res.render('sculpture',{ arts });
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
    res.render('artist',{ arts });
  // })
  // .catch(error => {
  //   console.log(error)
  })
});

router.get("/search", (req, res) => {
  ArtWork.find({ artist: new RegExp(req.query.term, "i") })
  .then(artwork => {
    res.render('index',{arts: artwork });
  })
  
    });

router.get("/api/material", (req, res, next) => {
  ArtWork.find({})
    // .select("location.coordinates") // selects only certain fields
    .sort({ name: 1 }) // sorts by name
    .limit(10) // limits to the first 10 results
    .then(artworks => {
      res.json(artworks);
      // const coordinates = places.map(place => place.location.coordinates)
      // res.json(places)
    });
});

router.get("/:artworkId", (req, res, next) => {
  ArtWork.findById(req.params.artworkId)
  .then(artwork => {
    res.render("/", { artwork });
  }) 
  .catch(err => {
    console.log("Error while retriving the artworks", err);
  });
});

router.post("/artworks", uploadCloud.single('photo'), (req, res, next) => {
  const { artist, title, year, address, needsRepair } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  geo.geocode('mapbox.places', address, function (err, geoData) {
    // 
    
    console.log(geoData.features[0].geometry)

    const newArtWork = new ArtWork({ 
      artist,
      title,
      year,
      address,
      location: {
        formType: "Point",
        coordinates: geoData.features[0].geometry.coordinates,
      },
      imgPath,
      imgName,
      postedBy: req.user._id,
      needsRepair,
    })
    ArtWork.create(newArtWork)
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
  });
});


module.exports = router;