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
      })
      .sort({ bookingDate: -1 });
  },

  findBookingById: async (id) => {
    return await Booking.findById(id);
  },

  createTicket: async (data) => {
    const ticket = new Ticket(data);
    await ticket.save();
    return ticket;
  },

  findTicketByUserId: async (user) => {
    return await Ticket.find({ user })
      .populate({
        path: "theatre",
        select: "name city",
      })
      .populate({
        path: "movie",
        select: "name poster",
      })
      .sort({ issuedDate: -1 });
  },

  findById: async (id) => {
    return await Booking.findById(id);
  },

};

export default bookingRepository;
