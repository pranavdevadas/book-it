import adminRepository from "../repository/adminRepository.js";

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
    let existingCity = await adminRepository.findCity(name);

    if (existingCity) {
      throw new Error("City already exist");
    }

    let city = await adminRepository.createCity({ name });

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
};

export default adminService;
