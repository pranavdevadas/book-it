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
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
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
        },
      ],
      showTimes: [
        {
          time: {
            type: String,
            required: true,
          },
          seatStatus: [
            {
              seatNumber: {
                type: Number,
                required: true,
              },
              isBooked: {
                type: Boolean,
                required: true,
                default: false,
              },
            },
          ],
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
});

const Theatre = mongoose.model("Theatre", theatreSchema);
export default Theatre;
