import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
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
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    amount: {
      type: Number,
    },
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    require: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
    require: true,
  },
});

bookingSchema.index(
  { bookingDate: 1 },
  {
    expireAfterSeconds: 300,
    partialFilterExpression: { status: "pending" },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
