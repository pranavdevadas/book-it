import showRepository from "../repository/showRepository.js";
import Theatre from "../model/theatre.js";
import Movie from "../model/movie.js";
import Owner from "../model/owner.js";
import { getDistance } from "geolib";

const showService = {
  getAllShows: async (ownerId) => {
    return await showRepository.findAll(ownerId);
  },

  getAllMovies: async () => {
    return await showRepository.findAllMovies({isListed: true});
  },

  addShow: async (showData, owner) => {
    const { movie, language, theatre, screen, showtime } = showData;
    
    if (!movie || !theatre || !screen || !showtime.length ) {
      throw new Error("Please provide all required fields");
    }

    const theatres = await Theatre.findById(theatre);
    const movies = await Movie.findById(movie);
    const ownerId = await Owner.findById(owner);

    const existingShow = await showRepository.findOne({
      theatre: theatres._id,
      screen,
      showtime: { $in: showtime },
      isListed: true
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

  if (!show.isListed) {
    const existingListedShow = await showRepository.findOne({
      theatre: show.theatre,
      screen: show.screen,
      showtime: { $in: show.showtime },
      isListed: true
    });

    if (existingListedShow) {
      throw new Error("Another show is already listed at this time for the same screen.");
    }
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

  getAvailableShows : async (movieId, userLat, userLng) => {
    const shows = await showRepository.getShowsByMovieId(movieId);
    if (!shows || shows.length === 0) {
      throw new Error("No shows found for this movie");
    }
  
    const filteredShows = shows.filter((show) => {
      const { lat: theatreLat, lng: theatreLng } = show.theatre.location;
      const distance = getDistance(
        { latitude: userLat, longitude: userLng },
        { latitude: theatreLat, longitude: theatreLng }
      );
      return distance <= 26000;
    });


    return filteredShows;
  },

};

export default showService;
