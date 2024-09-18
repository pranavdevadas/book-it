import bookingRepository from "../repository/bookingRepository.js";
import theatreRepository from "../repository/theatreRepository.js";
import QRCode from "qrcode";
import Ticket from '../model/ticket.js'

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

    if (booking.status === "confirmed") {

      try {
        const generateUniqueTicketNumber = async () => {
          let ticketNumber;
          let isUnique = false;
          while (!isUnique) {
            ticketNumber = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
            const existingTicket = await Ticket.findOne({ ticketNumber });
            if (!existingTicket) isUnique = true; // Ensures uniqueness
          }
          return ticketNumber;
        };
  
        const ticketNumber = await generateUniqueTicketNumber();
  
        // Generate a QR code for the ticket
        const qrCodeData = `Booking ID: ${booking._id}, Ticket No: ${ticketNumber}, Movie: ${movieId}, Seats: ${selectedSeats.join(",")}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);
  
        const tiket = await bookingRepository.createTicket({
          booking: booking._id,
          user: userId,
          movie: movieId,
          theatre: theatreId,
          screen,
          seats: selectedSeats,
          showDate: selectedDate,
          showTime: selectedTime,
          ticketNumber,
          qrCode, 
        });

        console.log(tiket)
      } catch (error) {
        console.log(error)
      }

      
    }

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

  findOwnerBookings: async (ownerId) => {
    const bookings = await bookingRepository.findBookingByOwnerId(ownerId);
    if (!bookings) {
      throw new Error("Bookings not found");
    }
    return bookings;
  },
};

export default bookingService;
