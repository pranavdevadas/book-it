import expressAsyncHandler from "express-async-handler";
import bookingService from "../service/bookingService.js";

const bookingController = {
  getSeatsForBooking: expressAsyncHandler(async (req, res) => {
    try {
      const { theatreId, screen } = req.params;
      const seats = await bookingService.getSeatsForBooking(theatreId, screen);
      res.json({ seats });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  createBooking: expressAsyncHandler(async (req, res) => {
    try {
      const {
        movieId,
        theatreId,
        owner,
        screen,
        selectedSeats,
        selectedDate,
        selectedTime,
        paymentMethod,
        totalPrice,
      } = req.body;

      console.log(owner)

      const createdBooking = await bookingService.createBooking(
        req.user._id,
        movieId,
        theatreId,
        owner,
        screen,
        selectedSeats,
        selectedDate,
        selectedTime,
        paymentMethod,
        totalPrice
      );

      res.status(201).json(createdBooking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getBookingForSeats: expressAsyncHandler(async (req, res) => {
    try {
      const { theatreId, screen, selectedTime, selectedDate } = req.query;

      if (!theatreId || !screen || !selectedDate || !selectedTime) {
        return res
          .status(400)
          .json({ message: "Missing required query parameters" });
      }

      const bookedSeats = await bookingService.getBookingForSeats(
        theatreId,
        screen,
        selectedDate,
        selectedTime
      );
      res.status(200).json(bookedSeats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  OwnerBookings: expressAsyncHandler(async (req, res) => {
    try {
      const bookings = await bookingService.findOwnerBookings(req.owner._id)
      res.status(200).json(bookings)
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
};

export default bookingController;
