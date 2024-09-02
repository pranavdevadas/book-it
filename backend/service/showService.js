import showRepository from "../repository/showRepository.js";
import Theatre from "../model/theatre.js";
import Movie from "../model/movie.js";

const showService = {
  getAllShows: async () => {
    return await showRepository.findAll();
  },

  getAllMovies: async () => {
    return await showRepository.findAllMovies()
  },

  addShow: async (showData) => {
    const { movie, theatre, screen, showtime } = showData;

    if (!movie || !theatre || !screen || !showtime.length) {
      throw new Error("Please provide all required fields");
    }

    const theatres = await Theatre.findById(theatre);
    const movies = await Movie.findById(movie);

    const existingShow = await showRepository.findOne({
      movie: movies.name,
      theatre: theatres.name,
      screen,
      showtime: { $in: showtime },
    });

    if (existingShow) {
      throw new Error("A show with the same details already exists.");
    }

    const newShow = {
      movie: movies.name,
      theatre: theatres.name,
      screen,
      showtime,
    };

    return await showRepository.create(newShow);
  },

  toggleShowStatus: async (id) => {
    const show = await showRepository.findById(id);
    if (!show) {
      throw new Error("Show Not Found");
    }
    show.isListed = !show.isListed;
    return await showRepository.update(show);
  },
};

export default showService;
