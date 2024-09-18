import bookingRepository from "../repository/bookingRepository.js";
import theatreRepository from "../repository/theatreRepository.js";

const bookingService = {
  getSeatsForBooking: async (theatreId, screen) => {
    const theatre = await theatreRepository.findTheatreById(theatreId);
    if (!theatre) {
      throw new Error("Theatre not found");
    }

    const screenData = theatre.screens.find((s) => s.name === screen);
    if (!screenData) {
      throw new Error("Screen not found");
    }

    return screenData.seats;
  },

  createBooking: async (
    userId,
    movieId,
    theatreId,
    owner,
    screen,
    selectedSeats,
    selectedDate,
    selectedTime,
    paymentMethod,
    totalPrice
  ) => {
    const booking = await bookingRepository.createBooking({
      userId,
      movieId,
      theatreId,
      owner,
      screen,
      selectedSeats,
      selectedDate,
      selectedTime,
      paymentMethod,
      totalPrice,
    });

    const theatre = await theatreRepository.findTheatreById(theatreId);
    if (!theatre) {
      throw new Error("Theatre not found");
    }

    const selectedScreen = theatre.screens.find((s) => s.name === screen);
    if (!selectedScreen) {
      throw new Error("Screen not found");
    }

    const showTime = selectedScreen.showTimes.find(
      (time) => time.time === selectedTime
    );
    if (!showTime) {
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

    await theatreRepository.saveTheatre(theatre);
    return booking;
  },

  getBookingForSeats: async (theatreId, screen, selectedDate, selectedTime) => {
    const bookings = await bookingRepository.getBookingsByCriteria({
      theatre: theatreId,
      screen,
      showDate: selectedDate,
      showTime: selectedTime,
      status: "confirmed",
    });

    if (bookings.length === 0) {
      throw new Error("No bookings found for the given parameters");
    }

    return bookings.flatMap((booking) => booking.seats);
  },

  findOwnerBookings: async(ownerId) => {
    const bookings = await bookingRepository.findBookingByOwnerId(ownerId)
    if (!bookings) {
      throw new Error('Bookings not found')
    }
    return bookings
  }
};

export default bookingService;
