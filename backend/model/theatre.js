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
});

const Theatre = mongoose.model("Theatre", theatreSchema);
export default Theatre;
