import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
  },
  screen: {
    type: String,
  },
  seats: [
    {
      type: String,
    },
  ],
  showTime: {
    type: String,
  },
  showDate: {
    type: String,
  },
  payment: {
    method: {
      type: String,
      enum: ["wallet", "razorpay"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    amount: {
      type: Number,
    },
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    require: true
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
    require: true
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
