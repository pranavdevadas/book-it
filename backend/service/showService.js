import showRepository from "../repository/showRepository.js";
import Theatre from "../model/theatre.js";
import Movie from "../model/movie.js";
import Owner from "../model/owner.js";

const showService = {
  getAllShows: async () => {
    return await showRepository.findAll();
  },

  getAllMovies: async () => {
    return await showRepository.findAllMovies();
  },

  addShow: async (showData, owner) => {
    const { movie, language, theatre, screen, showtime } = showData;

    
    
    if (!movie || !theatre || !screen || !showtime.length) {
      throw new Error("Please provide all required fields");
    }

    const theatres = await Theatre.findById(theatre);
    const movies = await Movie.findById(movie);
    const ownerId = await Owner.findById(owner)
    
    const existingShow = await showRepository.findOne({
      movie: movies._id,
      theatre: theatres._id,
      screen,
      showtime: { $in: showtime },
    });

    if (existingShow) {
      throw new Error("A show with the same details already exists.");
    }

    const newShow = {
      owner: ownerId._id,
      movie: movies._id,
      language,
      theatre: theatres._id,
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
