import User from "../model/user.js";
import Savedmovielist from "../model/savedmovielist.js";

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
      "items.movie": movieId,
    });
  },

  updateSavedMovie: async (userId, movieId) => {
    return await Savedmovielist.updateOne(
      { user: userId },
      { $push: { items: { movie: movieId } } },
      { upsert: true }
    );
  },
};

export default userRepository;
