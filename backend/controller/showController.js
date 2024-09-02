import expressAsyncHandler from "express-async-handler";
import showService from "../service/showService.js";

const showController = {
  getShows: expressAsyncHandler(async (req, res) => {
    try {
      const shows = await showService.getAllShows();
      res.status(200).json(shows);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  getAllMovies: expressAsyncHandler(async (req, res) => {
    try {
      const movies = await showService.getAllMovies()      
      res.status(200).json(movies)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  addShow: expressAsyncHandler(async (req, res) => {
    try {
      const savedShow = await showService.addShow(req.body);
      res.status(200).json({
        message: "Show added successfully",
        show: savedShow,
      });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  toggleStatus: expressAsyncHandler(async (req, res) => {
    try {
      const updatedShow = await showService.toggleShowStatus(req.params.id);
      res.status(200).json(updatedShow);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),
};

export default showController;
