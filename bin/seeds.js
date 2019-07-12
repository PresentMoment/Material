const mongoose = require("mongoose");
const ArtWork = require("../models/ArtWork");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const bcryptSalt = 10;

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
});

// //reverse geocode
// let latlngObj = [];
// ArtWork.find().then(artworks => {
//   artworks.forEach(artwork => {
//     latlngObj.push(artwork.location.coordinates.reverse())
//     console.log(latlngObj)

//   })
// });















// const artwork = [
//   {
//     artist: "",
//     title: "",
//     year: [],
//     location: {
//       coordinates: {
//         type: [Number],
//         required: true
//       }
//     },
//     needsRepair: null
//   },
// ];

// let users = [
//   {
//     username: "alice",
//     password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
//   },
//   {
//     username: "bob",
//     password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
//   }
// ]

// User.deleteMany()
// .then(() => {
//   return User.create(users)
// })
// .then(usersCreated => {
//   console.log(`${usersCreated.length} users created with the following id:`);
//   console.log(usersCreated.map(u => u._id));
// })
// .then(() => {
//   // Close properly the connection to Mongoose
//   mongoose.disconnect()
// })
// .catch(err => {
//   mongoose.disconnect()
//   throw err
// })
