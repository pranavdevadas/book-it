import theatreRepository from '../repository/theatreRepository.js';

let theatreService = {
  addTheatre: async (theatreData) => {
    try {
      const { name, city, location, ticketPrice, screens } = theatreData;
      const theatre = {
        name,
        city,
        location,
        ticketPrice,
        screens: screens.map(screen => ({
          ...screen,
          seats: screen.seats.map(seat => ({
            seatNumber: seat.seatNumber,
            isSelected: seat.isSelected,
            isBooked: seat.isBooked,
          })),
        })),
      };

      return await theatreRepository.createTheatre(theatre);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getTheatres: async () => {
    try {
      return await theatreRepository.findAllTheatres();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getTheatreById: async (id) => {
    try {
      const theatre = await theatreRepository.findTheatreById(id);
      if (!theatre) throw new Error("Theatre not found");
      return theatre;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  editTheatre: async (id, updateData) => {
    try {
      const { name, city, location, ticketPrice, screens } = updateData;

      const updatedTheatreData = {
        name: name || undefined,
        city: city || undefined,
        location: location || undefined,
        ticketPrice: ticketPrice || undefined,
        screens: screens.map((screen) => {
          const updatedSeats = screen.seats.map((seat) => ({
            seatNumber: seat.seatNumber,
            isSelected: seat.isSelected || false,
            isBooked: seat.isBooked || false,
          }));

          return {
            name: screen.name || "",
            seats: updatedSeats,
            showTimes: screen.showTimes || [],
          };
        }),
      };

      return await theatreRepository.updateTheatreById(id, updatedTheatreData);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default theatreService;
