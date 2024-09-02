import mongoose from "mongoose";

let showSchema = mongoose.Schema({
  movie: {
    type: String,
    required: true,
  },
  theatre: {
    type: String,
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
});

const Show = mongoose.model("Show", showSchema);
export default Show;
