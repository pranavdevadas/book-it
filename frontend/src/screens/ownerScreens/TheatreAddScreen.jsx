import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer";
import SeatSelection from "../../components/ownerComonents/SeatSelection";
import { toast } from "react-toastify";
import {
  useOwnerAddTheatreMutation,
  useGetCitiesQuery,
} from "../../slice/ownerSlice/ownerApiSlice";
import { useNavigate } from "react-router-dom";
import SideBarOwner from "../../components/ownerComonents/SideBar";

function TheatreAddScreen() {
  const [screens, setScreens] = useState([]);
  const [theatreName, setTheatreName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const [addTheatre] = useOwnerAddTheatreMutation();
  const { data: cities, error, isLoading } = useGetCitiesQuery();
  const navigate = useNavigate();

  const handleAddScreen = () => {
    setScreens([...screens, { name: "", showTimes: [], seats: {} }]);
  };

  const handleScreenNameChange = (index, value) => {
    const updatedScreens = [...screens];
    updatedScreens[index].name = value;
    setScreens(updatedScreens);
  };

  const handleAddShowTime = (screenIndex) => {
    const updatedScreens = [...screens];
    if (updatedScreens[screenIndex].showTimes.length < 4) {
      updatedScreens[screenIndex].showTimes.push("");
      setScreens(updatedScreens);
    }
  };

  const handleShowTimeChange = (screenIndex, showTimeIndex, value) => {
    const updatedScreens = [...screens];
    updatedScreens[screenIndex].showTimes[showTimeIndex] = value;
    setScreens(updatedScreens);
  };

  const handleSeatChange = (screenIndex, row, col) => {
    const seatKey = `${row + 1}-${col + 1}`;
    const updatedScreens = [...screens];
    const currentSeats = updatedScreens[screenIndex].seats;

    // Toggle seat selection
    if (currentSeats[seatKey]) {
      delete currentSeats[seatKey];
    } else {
      currentSeats[seatKey] = {
        seatNumber: parseInt(seatKey.replace("-", ""), 10),
        isSelected: true,
        isBooked: false,
      };
    }

    updatedScreens[screenIndex].seats = currentSeats;
    setScreens(updatedScreens);
  };

  const validateForm = () => {
    const namePattern = /^[A-Za-z\s]{3,}$/;
    const locationPattern =
      /^https:\/\/maps\.app\.goo\.gl\/|^maps\.app\.goo\.gl\//;
    const pricePattern = /^[0-9]{2,3}$/;

    if (!namePattern.test(theatreName)) {
      toast.error("Invalid theatre name.");
      return false;
    }
    if (!locationPattern.test(location)) {
      toast.error("Invalid location link.");
      return false;
    }
    if (!city) {
      toast.error("Select at least one city.");
      return false;
    }
    if (
      !pricePattern.test(ticketPrice) ||
      ticketPrice < 99 ||
      ticketPrice > 700
    ) {
      toast.error("Invalid Ticket Price");
      return false;
    }
    if (screens.length === 0) {
      toast.error("Select at least one screen.");
      return false;
    }
    for (let screen of screens) {
      if (
        !screen.name ||
        isNaN(screen.name) ||
        screen.name < 1 ||
        screen.name > 10
      ) {
        toast.error("Screen number must be between 1 and 10.");
        return false;
      }
      if (screen.showTimes.length === 0) {
        toast.error("Select at least one show time.");
        return false;
      }
      if (screen.showTimes.length > 4) {
        toast.error("Maximum 4 show times can be added.");
        return false;
      }
      const selectedSeats = Object.keys(screen.seats).length;
      if (selectedSeats < 10) {
        toast.error("Select a minimum of 10 seats.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const processedScreens = screens.map((screen) => {
      const seatObjects = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 12; col++) {
          const seatKey = `${row + 1}-${col + 1}`;
          const seat = screen.seats[seatKey] || {
            seatNumber: parseInt(seatKey.replace("-", ""), 10),
            isSelected: false,
            isBooked: false,
          };
          seatObjects.push(seat);
        }
      }

      return {
        ...screen,
        seats: seatObjects,
      };
    });

    try {
      await addTheatre({
        name: theatreName,
        city,
        location,
        ticketPrice,
        screens: processedScreens,
      }).unwrap();

      toast.success("Theatre added successfully");
      navigate("/owner/theatres");
    } catch (error) {
      console.error("Error submitting theatre:", error);
    }
  };

  return (
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <FormContainer >
          <h1>Add Theatre</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Theatre Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter theatre name"
                value={theatreName}
                onChange={(e) => setTheatreName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a city
                </option>
                {isLoading && <option>Loading cities...</option>}
                {error && <option>Error loading cities</option>}
                {cities &&
                  cities.map((city) => (
                    <option key={city._id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="ticketPrice">
              <Form.Label>Ticket Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ticket price"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                required
              />
            </Form.Group>

            {screens.map((screen, screenIndex) => (
              <div key={screenIndex} className="mt-3">
                <Form.Group controlId={`screenName-${screenIndex}`}>
                  <Form.Label>Screen No.</Form.Label>
                  <Form.Control
                    type="number"
                    style={{ width: "12%" }}
                    value={screen.name}
                    onChange={(e) =>
                      handleScreenNameChange(screenIndex, e.target.value)
                    }
                    required
                  />
                </Form.Group>

                {screen.showTimes.map((showTime, showTimeIndex) => (
                  <Form.Group
                    controlId={`showTime-${screenIndex}-${showTimeIndex}`}
                    key={showTimeIndex}
                  >
                    <Form.Label>Show Time</Form.Label>
                    <Form.Control
                      type="time"
                      style={{ width: "22%" }}
                      value={showTime}
                      onChange={(e) =>
                        handleShowTimeChange(
                          screenIndex,
                          showTimeIndex,
                          e.target.value
                        )
                      }
                      required
                    />
                  </Form.Group>
                ))}
                <br />

                <Button
                  variant="dark"
                  onClick={() => handleAddShowTime(screenIndex)}
                  className="mb-3"
                  disabled={screen.showTimes.length >= 4}
                >
                  Add Show Time
                </Button>

                <br />
                <Form.Label className="mt-3">Seats</Form.Label>
                <SeatSelection
                  seats={screen.seats}
                  handleSeatChange={(row, col) =>
                    handleSeatChange(screenIndex, row, col)
                  }
                />
              </div>
            ))}

            <Button variant="dark" onClick={handleAddScreen} className="mt-3">
              Add Screen
            </Button>
            <br />
            <br />
            <br />
            <Button type="submit" variant="primary" className="mt-3">
              Submit
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
}

export default TheatreAddScreen;
