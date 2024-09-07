import expressAsyncHandler from "express-async-handler";
import theatreService from "../service/theatreService.js";

let theatreController = {
  addTheatre: expressAsyncHandler(async (req, res) => {
    try {
      const theatreData = req.body;
      const savedTheatre = await theatreService.addTheatre(theatreData, req.owner.id);
      res.status(200).json(savedTheatre);
    } catch (error) {      
      res.status(400).json({ message: error.message });
    }
  }),

  getTheatres: expressAsyncHandler(async (req, res) => {
    try {
      const theatres = await theatreService.getTheatres(req.owner.id);
      res.status(200).json(theatres);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getListedTheatres: expressAsyncHandler(async (req,res) => {
    try {
      const theatres = await theatreService.getListedTheatres(req.owner.id);
      res.status(200).json(theatres);
    } catch (error) {
      res.status(400).json({message : error.message})
    }
  }),

  getTheatreById: expressAsyncHandler(async (req, res) => {
    try {
      const theatre = await theatreService.getTheatreById(req.params.id);
      res.status(200).json(theatre);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }),

  editTheatre: expressAsyncHandler(async (req, res) => {
    try {
      const updateData = req.body;
      
      const updatedTheatre = await theatreService.editTheatre(req.params.id, updateData);
      res.status(200).json(updatedTheatre);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getTheatresForAdmin: expressAsyncHandler(async (req, res) => {
    try {
      const theatres = await theatreService.getTheatresForAdmin()
      res.status(200).json(theatres)
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  toggleTheatreStatus: expressAsyncHandler(async (req, res) => {
    try {
      const {updatedTheatre} = await theatreService.toggleTheatreStatus(req.params.id)
      res.status(200).json(updatedTheatre)
    } catch (error) {
      console.log(error);
      
      res.status(400).json({ message: error.message });
    }
  })
};

export default theatreController;
