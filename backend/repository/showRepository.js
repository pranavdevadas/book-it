import Movie from "../model/movie.js";
import Show from "../model/show.js";

const showRepository = {
  findAll: async () => {
    return await Show.find();
  },

  findAllMovies: async() => {
    return await Movie.find({isListed: true})
  },

  findById: async (id) => {
    return await Show.findById(id);
  },

  findOne: async (query) => {
    return await Show.findOne(query);
  },

  create: async (data) => {
    const newShow = new Show(data);
    return await newShow.save();
  },

  update: async (show) => {
    return await show.save();
  },
};

export default showRepository;
