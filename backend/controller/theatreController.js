import expressAsyncHandler from "express-async-handler";
import Theatre from "../model/theatre.js";
import { Seat } from "../model/seat.js";

let theatreController = {
  addTheatre: expressAsyncHandler(async (req, res) => {
    try {
      const { name, city, location, ticketPrice, screens } = req.body;

      const theatre = new Theatre({
        name,
        city,
        location,
        ticketPrice,
        screens: [],
      });

      for (let i = 0; i < screens.length; i++) {
        const screen = screens[i];

        const seat = new Seat({
          seats: screen.seats,
        });

        const savedSeat = await seat.save();

        theatre.screens.push({
          name: screen.name,
          seats: savedSeat._id,
          showTimes: screen.showTimes,
        });
      }

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
    let id = req.params.id;
    try {
      const theatre = await Theatre.findById(id).populate({
        path: "screens",
        populate: { path: "seats" },
      });      
      if (!theatre) {
        res.status(404).json({ message: "Theatre not found" });
        return;
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
        res.status(404).json({ message: "Theatre not found" });
        return;
      }

      theatre.name = name;
      theatre.city = city;
      theatre.location = location;
      theatre.ticketPrice = ticketPrice;

      // Update screens and seats
      for (let i = 0; i < screens.length; i++) {
        const screen = screens[i];
        const dbScreen = theatre.screens.id(screen._id);

        if (!dbScreen) continue;

        dbScreen.name = screen.name;
        dbScreen.showTimes = screen.showTimes;

        // Update seats
        const seatDoc = await Seat.findById(dbScreen.seats);
        seatDoc.seats.forEach((seat, index) => {
          seat.isAvailable = screen.seats[index]?.isAvailable || false;
          seat.isBooked = screen.seats[index]?.isBooked || false;
        });

        await seatDoc.save();
      }

      const updatedTheatre = await theatre.save();
      res.status(200).json(updatedTheatre);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
};

export default theatreController;
