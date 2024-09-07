import theatreRepository from "../repository/theatreRepository.js";
import Owner from "../model/owner.js";

let theatreService = {
  addTheatre: async (theatreData, owner) => {
    const { name, city, location, ticketPrice, screens } = theatreData;
    const normalizeName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const ownerId = await Owner.findById(owner);

    const existingTheatre = await theatreRepository.findTheatreByName(
      normalizeName,
      city
    );

    if (existingTheatre) {
      throw new Error("Theatre already exist");
    }

    const theatre = {
      owner: ownerId._id,
      name: normalizeName,
      city,
      location: { lat: location.lat, lng: location.lng },
      ticketPrice,
      screens: screens.map((screen) => ({
        ...screen,
        seats: screen.seats.map((seat) => ({
          seatNumber: seat.seatNumber,
          isSelected: seat.isSelected,
          isBooked: seat.isBooked,
        })),
      })),
    };
    return await theatreRepository.createTheatre(theatre);
  },

  getTheatres: async (ownerId) => {
    try {
      return await theatreRepository.findAllTheatres(ownerId);
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
  },

  getTheatresForAdmin: async () => {
    const theatres = await theatreRepository.findTheatres();
    if (!theatres) {
      throw new Error("Theatres not found");
    }
    return theatres;
  },
};

export default theatreService;
