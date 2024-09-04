import mongoose from "mongoose";

const movieScema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  duration: {
    type: String,
    require: true,
  },
  categories: {
    type: Array,
    require: true,
  },
  language: {
    type: Array,
    require: true,
  },
  cast: {
    type: Array,
    require: true,
  },
  poster: {
    type: String,
    require: true,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Movie = mongoose.model("Movie", movieScema);
export default Movie;
