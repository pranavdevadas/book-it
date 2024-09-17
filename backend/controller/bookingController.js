import Theatre from "../model/theatre.js";
import Booking from "../model/booking.js";
import expressAsyncHandler from "express-async-handler";

const bookingController = {
  getSeatsForBooking: expressAsyncHandler(async (req, res) => {
    try {
      const { theatreId, screen } = req.params;
      const theatre = await Theatre.findById(theatreId);
      if (!theatre) {
        return res.status(404).json({ message: "Theatre not found" });
      }
      const screenData = theatre.screens.find((s) => s.name === screen);
      if (!screenData) {
        return res.status(404).json({ message: "Screen not found" });
      }
      res.json({ seats: screenData.seats });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  createBooking: expressAsyncHandler(async (req, res) => {
    try {
      const {
        movieId,
        theatreId,
        screen,
        selectedSeats,
        selectedDate,
        selectedTime,
        paymentMethod,
        totalPrice,
      } = req.body;

      const booking = new Booking({
        user: req.user._id,
        movie: movieId,
        theatre: theatreId,
        screen: screen,
        seats: selectedSeats,
        showDate: selectedDate,
        showTime: selectedTime,
        payment: {
          method: paymentMethod,
          amount: totalPrice,
          status: "completed",
        },
        status: "confirmed",
      });

      const createdBooking = await booking.save();

      const theatre = await Theatre.findById(theatreId);

      if (!theatre) {
        res.status(404);
        throw new Error("Theatre not found");
      }

      const selectedScreen = theatre.screens.find((s) => s.name === screen);
      if (!selectedScreen) {
        res.status(404);
        throw new Error("Screen not found");
      }

      const showTime = selectedScreen.showTimes.find(
        (time) => time.time === selectedTime
      );

      if (!showTime) {
        res.status(404);
        throw new Error("Showtime not found");
      }

      selectedSeats.forEach((seatNumber) => {
        const seat = showTime.seatStatus.find(
          (seat) => seat.seatNumber === parseInt(seatNumber)
        );
        if (seat) {
          seat.isBooked = true;
        }
      });

      await theatre.save();

      res.status(201).json(createdBooking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getBookingForSeats: expressAsyncHandler(async (req, res) => {
    try {
      const { theatreId, screen, selectedTime, selectedDate } = req.query;
      
    if (!theatreId || !screen || !selectedDate || !selectedTime) {
      res.status(400).json({ message: 'Missing required query parameters' });
      return;
    }

    const bookings = await Booking.find({
      theatre: theatreId,
      screen: screen,
      showDate: selectedDate,
      showTime: selectedTime,
      status: 'confirmed'
    });

    if (bookings.length === 0) {
      res.status(404).json({ message: 'No bookings found for the given parameters' });
      return;
    }

    const bookedSeats = bookings.flatMap(booking => booking.seats);
    res.status(200).json(bookedSeats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
};

export default bookingController;
