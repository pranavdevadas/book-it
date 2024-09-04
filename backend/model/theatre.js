import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
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
  location: {
    type: String,
    required: true,
  },
  screens: [
    {
      name: {
        type: String,
        required: true,
      },
      seats: [
        {
          seatNumber: {
            type: Number,
            required: true,
          },
          isSelected: {
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
      showTimes: {
        type: [String],
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Theatre = mongoose.model("Theatre", theatreSchema);
export default Theatre;
