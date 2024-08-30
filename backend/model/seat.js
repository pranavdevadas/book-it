import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seats: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      seatNumber: {
        type: Number,
        required: true,
      },
      isAvailable: {
        type: Boolean,
        required: true,
        default: false,
      },
      isBooked: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

const Seat = mongoose.model("Seat", seatSchema);
export { Seat };
