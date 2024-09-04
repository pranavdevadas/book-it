import mongoose from "mongoose";

const citySchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("City", citySchema);
