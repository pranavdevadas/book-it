import Movie from "../model/movie.js";
import Show from "../model/show.js";

const showRepository = {
  findAll: async (owner) => {
    return await Show.find({ owner: owner })
      .populate("movie", "name duration categories language")
      .populate("theatre", "name city location").sort({date : -1})
  },

  findAllMovies: async () => {
    return await Movie.find({ isListed: true });
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

  findShowsForUser: async () => {
    const shows = await Show.find({ isListed: true })
    .populate('movie', 'name duration categories language poster') 
    .populate('theatre', 'name city screens');

  return shows.map(show => ({
    showId: show._id,
    movie: show.movie,  
    theatre: show.theatre,
    screen: show.screen,
    showtime: show.showtime,
    language: show.language,
  }));
  },

  getShowsByMovieId : async (id) => {
    return await Show.find({ movie: id, isListed: true })
      .populate("theatre", "name city location")
      .populate("screen");
  },
}

export default showRepository;
