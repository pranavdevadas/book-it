import Admin from "../model/admin.js";
import City from "../model/city.js";
import Movie from '../model/movie.js'

let adminRepository = {
  findAdminByEmail: async (email) => {
    return await Admin.findOne({ email });
  },

  findCity: async (name) => {
    return await City.findOne({ name });
  },

  createCity: async (city) => {
    return await City.create(city);
  },

  findCities: async () => {
    return await City.find();
  },

  findByMovieName: async (name) => {
    return await Movie.findOne({ name });
  },

  createMovie: async (movieData) => {
    const movie = new Movie(movieData);
    return await movie.save();
  },

  findMovies: async () => {
    return await Movie.find()
  },

  findMovieById: async (id) => {
    return await Movie.findById(id)
  },

  updateMovie: async (id, updatedData) => {
    if (updatedData.categories) {
      updatedData.categories = JSON.parse(updatedData.categories);
    }
    if (updatedData.language) {
      updatedData.language = JSON.parse(updatedData.language);
    }
    if (updatedData.cast) {
      updatedData.cast = updatedData.cast.split(',').map(actor => actor.trim());
    }
    return await Movie.findByIdAndUpdate(id, updatedData, { new: true });
  },
  
};

export default adminRepository;
