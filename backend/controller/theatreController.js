import expressAsyncHandler from "express-async-handler";
import Theatre from "../model/theatre.js";

let theatreController = {
  addTheatre: expressAsyncHandler(async (req, res) => {
    try {
      const { name, city, location, ticketPrice, screens } = req.body;
  
      const theatre = new Theatre({
        name,
        city,
        location,
        ticketPrice,
        screens: screens.map(screen => ({
          ...screen,
          seats: screen.seats.map(seat => ({
            seatNumber: seat.seatNumber,
            isSelected: seat.isSelected,
            isBooked: seat.isBooked,
          })),
        })),
      });
  
      const savedTheatre = await theatre.save();
      res.status(201).json(savedTheatre);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getTheatres: expressAsyncHandler(async (req, res) => {
    try {
      const theatre = await Theatre.find()
      if (!theatre) {
        return res.status(404).json({ message: "Theatre not found" });
      }
      res.json(theatre);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getTheatreById: expressAsyncHandler(async (req, res) => {    
    try {
      const theatre = await Theatre.findById(req.params.id);
  
      if (!theatre) {
        return res.status(404).json({ message: "Theatre not found" });
      }
  
      res.status(200).json(theatre);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  editTheatre: expressAsyncHandler(async (req, res) => {
    try {
      const { name, city, location, ticketPrice, screens } = req.body;
  
      const theatre = await Theatre.findById(req.params.id);
  
      if (!theatre) {
        return res.status(404).json({ message: "Theatre not found" });
      }
  
      theatre.name = name || theatre.name;
      theatre.city = city || theatre.city;
      theatre.location = location || theatre.location;
      theatre.ticketPrice = ticketPrice || theatre.ticketPrice;
  
      theatre.screens = screens.map((screen) => {
        const updatedSeats = screen.seats.map((seat, index) => {
          return {
            seatNumber: seat.seatNumber,
            isSelected: seat.isSelected || false,
            isBooked: seat.isBooked || false,
          };
        });
  
        return {
          name: screen.name || "",
          seats: updatedSeats,
          showTimes: screen.showTimes || [],
        };
      });
  
      const updatedTheatre = await theatre.save();
  
      res.status(200).json(updatedTheatre);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
};

export default theatreController;
