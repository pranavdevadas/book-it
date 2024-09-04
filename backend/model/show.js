import mongoose from "mongoose";

let showSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true,
  },
  screen: {
    type: String,
    required: true,
  },
  showtime: {
    type: Array,
    required: true,
  },
  isListed: {
    type: Boolean,
    required: true,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Show = mongoose.model("Show", showSchema);
export default Show;
