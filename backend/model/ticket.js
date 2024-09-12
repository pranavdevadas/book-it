import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
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
  seats: [
    {
      type: String, 
      required: true,
    },
  ],
  showDate: {
    type: String,
    required: true,
  },
  showTime: {
    type: String,
    required: true,
  },
  ticketNumber: {
    type: String,
    unique: true,
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  qrCode: {
    type: String,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
