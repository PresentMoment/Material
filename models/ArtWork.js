const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artWorkSchema = new Schema(
  {
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
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  needsRepair: {
    type: Boolean,
    default: false,
    required: false
  },
  imgName: String,
  imgPath: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  });

const ArtWork = mongoose.model("Art Work", artWorkSchema);

module.exports = ArtWork;