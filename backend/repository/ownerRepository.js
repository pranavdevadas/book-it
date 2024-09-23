import City from "../model/city.js";
import Owner from "../model/owner.js";
import Rating from "../model/ratingandreview.js";

let ownerRepository = {
  findOwnerByEmail: async (email) => {
    return await Owner.findOne({ email });
  },

  findOwnerById: async (Id) => {
    return await Owner.findById(Id);
  },

  createOwner: async (ownerData) => {
    return await Owner.create(ownerData);
  },

  saveOwner: async (owner) => {
    return await owner.save();
  },

  findOwners: async () => {
    return await Owner.find().sort({ createdAt: -1 });
  },

  findCities: async () => {
    return await City.find();
  },

  findMoviesFromRating: async () => {
    return await Rating.aggregate([
      {
        $group: {
          _id: "$movie", 
          averageRating: { $avg: { $toDouble: "$rating" } },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 5,
      },
    ])
      .exec()
      .then((topMovies) => {
        return Rating.populate(topMovies, {
          path: "_id",
          select: "name", 
          model: "Movie",
        });
      });
  },
};

export default ownerRepository;
