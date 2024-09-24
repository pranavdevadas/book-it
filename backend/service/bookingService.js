import bookingRepository from "../repository/bookingRepository.js";
import theatreRepository from "../repository/theatreRepository.js";
import QRCode from "qrcode";
import Ticket from "../model/ticket.js";
import walletRepository from "../repository/walletRepository.js";

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
    selectedTime
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
    });

    return booking;
  },

  getBookingForSeats: async (theatreId, screen, selectedDate, selectedTime) => {
    const bookings = await bookingRepository.getBookingsByCriteria({
      theatre: theatreId,
      screen,
      showDate: selectedDate,
      showTime: selectedTime,
      status: { $in: ["pending", "confirmed"] },
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

  getTickets: async (id) => {
    const tickets = await bookingRepository.findTicketByUserId(id);
    if (!tickets) {
      throw new Error("No Tickets found");
    }
    return tickets;
  },

  updateBookingAndCreate: async (
    BookingId,
    paymentMethod,
    paymentStatus,
    totalPrice,
    userId
  ) => {
    const booking = await bookingRepository.findById(BookingId);

    if (!booking) {
      throw new Error("Booking not found.");
    }

    

    booking.payment.method = paymentMethod;

    if (paymentMethod === "wallet") {
      let wallet = await walletRepository.findByUserId(userId);

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      if (wallet.balance < totalPrice) {
        throw new Error('Insufficient Balance')
      } else {
        wallet.balance = wallet.balance - totalPrice
        await wallet.save()
        await walletRepository.createTransaction({
          userId,
          amount: parseInt(totalPrice),
          status: "Success",
          type: "Debit",
        });
      }

    }

    booking.payment.status = paymentStatus;
    booking.payment.amount = totalPrice;
    booking.status = "confirmed";

    await booking.save();

    if (booking.status === "confirmed") {
      const generateUniqueTicketNumber = async () => {
        let ticketNumber;
        let isUnique = false;
        while (!isUnique) {
          ticketNumber = Math.floor(100000 + Math.random() * 900000).toString();
          const existingTicket = await Ticket.findOne({ ticketNumber });
          if (!existingTicket) isUnique = true;
        }
        return ticketNumber;
      };

      const ticketNumber = await generateUniqueTicketNumber();
      const qrCodeData = `Booking ID: ${
        booking._id
      }, Ticket No: ${ticketNumber}, Movie: ${
        booking.movie
      }, Seats: ${booking.seats.join(", ")}`;
      const qrCode = await QRCode.toDataURL(qrCodeData);

      await bookingRepository.createTicket({
        booking: booking._id,
        user: booking.user,
        movie: booking.movie,
        theatre: booking.theatre,
        screen: booking.screen,
        seats: booking.seats,
        showDate: booking.showDate,
        showTime: booking.showTime,
        ticketNumber,
        qrCode,
      });
    }

    return booking;
  },

  cancelTicket: async (userId, ticketId, amount) => {
    const parsedAmount = parseInt(amount);
    const ticket = await bookingRepository.findTicketById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    let wallet = await walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = await walletRepository.createWallet(userId, parsedAmount);
    } else {
      wallet = await walletRepository.updateWalletBalance(userId, parsedAmount);
    }

    await walletRepository.createTransaction({
      userId,
      amount: parsedAmount,
      status: "Success",
      type: "Refunded",
    });

    const booking = await bookingRepository.findBookingById(ticket.booking);

    if (!booking) {
      throw new Error("Booking not found.");
    }

    booking.seats = [];
    booking.status = "cancelled";
    await booking.save();

    ticket.isCancelled = true;
    await ticket.save();

    return ticket;
  },

  getBookings: async () => {
    const bookings = await bookingRepository.getBookings()

    return bookings
  },
};

export default bookingService;
