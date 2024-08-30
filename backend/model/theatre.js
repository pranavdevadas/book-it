import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  ticketPrice: {
    type: String,
    required: true,
  },
  screens: [
    {
      name: {
        type: String,
        required: true,
      },
      seats: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
      },
      showTimes: {
        type: Array,
        required: true,
      },
    },
  ],
  location: {
    type: String,
    required: true,
  },
});

const Theatre = mongoose.model("Theatre", theatreSchema);
export default Theatre;
