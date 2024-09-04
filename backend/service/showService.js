import showRepository from "../repository/showRepository.js";
import Theatre from "../model/theatre.js";
import Movie from "../model/movie.js";
import Owner from "../model/owner.js";

const showService = {
  getAllShows: async (ownerId) => {
    return await showRepository.findAll(ownerId);
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
    const ownerId = await Owner.findById(owner);

    const existingShow = await showRepository.findOne({
      theatre: theatres._id,
      screen,
      showtime: { $in: showtime },
    });

    if (existingShow) {
      throw new Error("Alerady added this show");
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

  getShowForUser: async () => {
    const show = await showRepository.findShowsForUser();
    if (!show) {
      throw new Error("No Shows currently playing");
    }
    return show;
  },
};

export default showService;
