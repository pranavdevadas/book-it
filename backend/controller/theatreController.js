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
};

export default theatreController;
