import mongoose from "mongoose";

const bannerSchema = mongoose.Schema({
  banner1: {
    type: String,
    require: true,
  },
  banner2: {
    type: String,
    require: true,
  },
  banner3: {
    type: String,
    require: true,
  },
});

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
