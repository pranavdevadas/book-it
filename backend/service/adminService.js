import adminRepository from "../repository/adminRepository.js";
import userRepository from "../repository/userRepository.js";
import OwnerRepository from "../repository/ownerRepository.js";

let adminService = {
  authenticateAdmin: async (email, password) => {
    const admin = await adminRepository.findAdminByEmail(email);
    if (admin && (await admin.matchPassword(password))) {
      return admin;
    } else {
      throw new Error("Invalid Email or Password");
    }
  },
  logoutAdmin: () => {
    return {
      httpOnly: true,
      expires: new Date(0),
      value: "",
    };
  },

  addCity: async (name) => {
    const normalizedCityName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      
    const existingCity = await adminRepository.findCity(normalizedCityName);

    if (existingCity) {
      throw new Error("City already exist");
    }

    const city = await adminRepository.createCity({name: normalizedCityName });

    return { city };
  },

  getCity: async () => {
    let city = await adminRepository.findCities();

    if (!city) {
      throw new Error("City Not Found");
    }

    return { city };
  },

  addMovie: async (movieData) => {
    const { name } = movieData;
    
    const existingMovie = await adminRepository.findByMovieName(name);
    if (existingMovie) {
      throw new Error("Movie already exists");
    }

    const createdMovie = await adminRepository.createMovie(movieData);
    return createdMovie;
  },

  getMovie: async () => {
    let movies = await adminRepository.findMovies();

    if (!movies) {
      throw new Error("No Movies Found");
    }

    return { movies };
  },

  togleListStatus: async (id) => {
    let movie = await adminRepository.findMovieById(id);
    if (!movie) {
      throw new Error("Movie Not Found");
    } else {
      movie.isListed = !movie.isListed;
      const updatedMovie = await movie.save();
      return { updatedMovie };
    }
  },

  editMovie: async (id, updatedData) => {
    const movie = await adminRepository.findMovieById(id);

    if (!movie) {
      throw new Error("Movie not found");
    }

    const updatedMovie = await adminRepository.updateMovie(id, updatedData);

    return { updatedMovie };
  },

  getMovieById: async (id) => {
    const movie = await adminRepository.findMovieById(id);

    if (!movie) {
      throw new Error("Movie not found");
    }
    return { movie };
  },

  getUsers: async () => {
    let users = await userRepository.findUsers();

    if (!users) {
      throw new Error("No User Found");
    }

    return { users };
  },

  blockUnblockUser: async (id) => {
    let user = await userRepository.findUserById(id);
    if (!user) {
      throw new Error("User Not Found");
    } else {
      user.isBlocked = !user.isBlocked;
      const updatedUser = await user.save();
      return updatedUser;
    }
  },

  getOwners: async () => {
    let owners = await OwnerRepository.findOwners();

    if (!owners) {
      throw new Error("No Owner Found");
    }

    return { owners };
  },

  blockUnblockOwner: async (id) => {
    let owner = await OwnerRepository.findOwnerById(id);
    if (!owner) {
      throw new Error("User Not Found");
    } else {
      owner.isBlocked = !owner.isBlocked;
      const updatedOwner = await owner.save();
      return { updatedOwner };
    }
  },
};

export default adminService;
