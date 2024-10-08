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
        })),
        showTimes: screen.showTimes.map((showTime) => ({
          time: showTime,
          seatStatus: screen.seats.map((seat) => ({
            seatNumber: seat.seatNumber,
            isBooked: seat.isBooked || false, // Assuming 'isBooked' should default to false initially
          })),
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

  getListedTheatres: async (ownerId) => {
    try {
      return await theatreRepository.findListedTheatres(ownerId);
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
        location: { lat: location.lat, lng: location.lng } || undefined,
        ticketPrice: ticketPrice || undefined,
        screens: screens.map((screen) => {
          const updatedSeats = screen.seats.map((seat) => ({
            seatNumber: seat.seatNumber,
            isSelected: seat.isSelected || false,
          }));

          return {
            name: screen.name || "",
            seats: updatedSeats,
            showTimes: screen.showTimes.map((showTime) => ({
              time: showTime.time,
              seatStatus: screen.seats.map((seat) => ({
                seatNumber: seat.seatNumber,
                isBooked: seat.isBooked || false,
              })),
            })),
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

  toggleTheatreStatus: async (id) => {
    let theatre = await theatreRepository.findTheatreById(id);
    if (!theatre) {
      throw new Error("Theatre Not Found");
    } else {
      theatre.isListed = !theatre.isListed;
      let updatedTheatre = await theatre.save();
      return { updatedTheatre };
    }
  },
};

export default theatreService;
