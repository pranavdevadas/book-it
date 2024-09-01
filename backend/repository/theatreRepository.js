import Theatre from '../model/theatre.js';

let theatreRepository = {
  createTheatre: async (theatreData) => {
    const theatre = new Theatre(theatreData);
    return await theatre.save();
  },

  findAllTheatres: async () => {
    return await Theatre.find();
  },

  findTheatreById: async (id) => {
    return await Theatre.findById(id);
  },

  updateTheatreById: async (id, updatedData) => {
    return await Theatre.findByIdAndUpdate(id, updatedData, { new: true });
  }
};

export default theatreRepository;
