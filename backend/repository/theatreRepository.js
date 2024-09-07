import Theatre from "../model/theatre.js";

let theatreRepository = {
  createTheatre: async (theatreData) => {
    const theatre = new Theatre(theatreData);
    return await theatre.save();
  },

  findAllTheatres: async (ownerId) => {
    return await Theatre.find({ owner: ownerId }).sort({ date: -1 });
  },

  findListedTheatres: async (ownerId) => {
    return await Theatre.find({ owner: ownerId, isListed: true }).sort({
      date: -1,
    });
  },

  findTheatreById: async (id) => {
    return await Theatre.findById(id);
  },

  updateTheatreById: async (id, updatedData) => {
    return await Theatre.findByIdAndUpdate(id, updatedData, { new: true });
  },

  findTheatreByName: async (name, city) => {
    return await Theatre.findOne({ name: name, city: city });
  },

  findTheatres: async () => {
    return await Theatre.find().populate("owner", "name").sort({ date: -1 });
  },
};

export default theatreRepository;
