import expressAsyncHandler from "express-async-handler";
import upload from "../config/multer.js";
import adminService from "../service/adminService.js";

let movieController = {
  addMovie: [
    upload.single("poster"),
    expressAsyncHandler(async (req, res) => {
      const { name, duration, categories, language, cast } = req.body;
      const normalizeName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      try {
        const movieData = {
          name : normalizeName,
          duration,
          categories: Array.isArray(categories) ? categories.map(cat => cat.trim()) : categories.split(",").map(cat => cat.trim()),
          language: Array.isArray(language) ? language.map(lang => lang.trim()) : language.split(",").map(lang => lang.trim()),
          cast: cast.split(",").map(actor => actor.trim()),
          poster: req.file ? req.file.filename : null,
        };
  
        const createdMovie = await adminService.addMovie(movieData);
        res.status(201).json(createdMovie);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }),
  ],

  getMovie: expressAsyncHandler(async (req, res) => {
    try {
      let { movies } = await adminService.getMovie();
      res.status(200).json(movies);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  toggleListStatus: expressAsyncHandler(async (req, res) => {
    try {
      let { updatedMovie } = await adminService.togleListStatus(req.params.id);
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  editMovie: [
    upload.single("poster"),
    expressAsyncHandler(async (req, res) => {
      let updatedData = req.body;
      try {
        if (req.file) {
          updatedData.poster = req.file.filename;
        }
  
        let { updatedMovie } = await adminService.editMovie(
          req.params.id,
          updatedData
        );
  
        res.status(200).json(updatedMovie);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }),
  ],

  getMovieById: expressAsyncHandler(async (req, res) => {
    try {
      let { movie } = await adminService.getMovieById(req.params.id);
      res.status(200).json(movie);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),
};

export default movieController;
