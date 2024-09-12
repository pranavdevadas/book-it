import User from "../model/user.js";
import Savedmovielist from "../model/savedmovielist.js";
import Banner from '../model/banner.js'

let userRepository = {
  findUserByEmail: async (email) => {
    return await User.findOne({ email });
  },

  findUserById: async (id) => {
    return await User.findById(id);
  },

  createUser: async (userData) => {
    return await User.create(userData);
  },

  saveUser: async (user) => {
    return await user.save();
  },

  findUsers: async () => {
    return await User.find().sort({ createdAt: -1 });
  },

  findSavedMovie: async (userId, movieId) => {
    return await Savedmovielist.findOne({
      user: userId,
      items: { $elemMatch: { movie: movieId } }, 
    })
    .sort({ "items.date": -1 }) 
  },

  updateSavedMovie: async (userId, movieId) => {
    return await Savedmovielist.updateOne(
      { user: userId },
      { $push: { items: { movie: movieId } } },
      { upsert: true }
    )
  },

  findSavedMovieByUserId: async (userId) => {
    return await Savedmovielist.findOne({ user: userId }).populate(
      "items.movie",
      "name duration categories language poster"
    );
  },

  deleteSavedMovieById: async (movieId, userId) => {
    return await Savedmovielist.findOneAndUpdate(
      { user: userId, "items.movie": movieId },
      { $pull: { items: { movie: movieId } } },
      { new: true }
    )
  },

  findBanner: async () => {
    return await Banner.findOne()
  }
};

export default userRepository;
