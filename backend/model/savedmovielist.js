import mongoose from "mongoose";

const savedMovieSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        require: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("SavedMovie", savedMovieSchema);
