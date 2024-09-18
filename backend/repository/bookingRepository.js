import Booking from "../model/booking.js";
import Ticket from "../model/ticket.js";

const bookingRepository = {
  createBooking: async ({
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
  }) => {
    const booking = new Booking({
      user: userId,
      movie: movieId,
      theatre: theatreId,
      owner,
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

  findBookingByOwnerId: async (ownerId) => {
    return await Booking.find({ owner: ownerId })
      .populate({
        path: "theatre",
        select: "name city",
      })
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "movie",
        select: "name",
      });
  },

  findBookingById: async (id) => {
    return await Booking.findById(id);
  },

  createTicket: async (data) => {
    const ticket = new Ticket(data);
    await ticket.save();
    return ticket;
  },
};

export default bookingRepository;
