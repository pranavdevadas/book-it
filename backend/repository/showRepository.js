import Movie from "../model/movie.js";
import Show from "../model/show.js";

const showRepository = {
  findAll: async (owner) => {
    return await Show.find({ owner: owner })
      .populate("movie", "name duration categories language")
      .populate("theatre", "name city location");
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
    // return await Show.find({isListed : true})
    //   .populate("movie", "name duration cast categories language")
    //   .populate("theatre", "owner name city location").sort({date : -1})
    const uniqueMovies = await Show.aggregate([
      {
        $match: { isListed: true }, 
      },
      {
        $group: {
          _id: "$movie", 
        },
      },
      {
        $lookup: {
          from: "movies", 
          localField: "_id",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      {
        $unwind: "$movieDetails", 
      },
      {
        $project: {
          _id: 0, 
          movieDetails: 1,
        },
      },
    ]);

    return uniqueMovies.map((item) => item.movieDetails);
  },
};

export default showRepository;
