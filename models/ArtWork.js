const mongoose = require("mongoose");
const { Schema } = mongoose;

const artWorkSchema = new Schema({
  artist: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  location: {
    type: [Number],
    required: true
  },
  needsRepair: Boolean
});

const ArtWork = mongoose.model("Art Work", artWorkSchema);

module.exports = ArtWork;