import Booking from "../model/booking.js";

const bookingRepository = {
  createBooking: async ({
    userId,
    movieId,
    theatreId,
    screen,
    selectedSeats,
    selectedDate,
    selectedTime,
    paymentMethod,
    totalPrice,
  }) => {
    const booking = new Booking({
      user: userId,
      movie: movieId,
      theatre: theatreId,
      screen,
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

    return await booking.save();
  },

  getBookingsByCriteria: async (criteria) => {
    return await Booking.find(criteria);
  },
};

export default bookingRepository;
