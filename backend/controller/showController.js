import expressAsyncHandler from "express-async-handler";
import showService from "../service/showService.js";

const showController = {
  getShows: expressAsyncHandler(async (req, res) => {
    try {
      const shows = await showService.getAllShows(req.owner.id);
      res.status(200).json(shows);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  getAllMovies: expressAsyncHandler(async (req, res) => {
    try {
      const movies = await showService.getAllMovies();
      res.status(200).json(movies);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  addShow: expressAsyncHandler(async (req, res) => {
    try {
      const savedShow = await showService.addShow(req.body, req.owner.id);
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

  getShowForUser: expressAsyncHandler(async (req, res) => {
    try {
      const shows = await showService.getShowForUser();
      res.status(200).json(shows);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  getAvailableShow: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        res
          .status(400)
          .json({ message: "Latitude and longitude are required" });
        return;
      }

      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      const filteredShows = await showService.getAvailableShows(
        id,
        userLat,
        userLng
      );
      res.status(200).json(filteredShows);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),
};

export default showController;
