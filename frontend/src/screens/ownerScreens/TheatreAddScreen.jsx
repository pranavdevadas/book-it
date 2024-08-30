import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer";
import SeatSelection from "../../components/ownerComonents/SeatSelection";
import { useOwnerAddTheatreMutation } from "../../slice/ownerSlice/ownerApiSlice";

function TheatreAddScreen() {
  const [screens, setScreens] = useState([]);
  const [theatreName, setTheatreName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const [addTheatre] = useOwnerAddTheatreMutation();

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
    updatedScreens[screenIndex].showTimes.push("");
    setScreens(updatedScreens);
  };

  const handleShowTimeChange = (screenIndex, showTimeIndex, value) => {
    const updatedScreens = [...screens];
    updatedScreens[screenIndex].showTimes[showTimeIndex] = value;
    setScreens(updatedScreens);
  };

  const handleSeatChange = (screenIndex, row, col) => {
    const seatKey = `${row}-${col}`;
    const updatedScreens = [...screens];
    const currentSeats = updatedScreens[screenIndex].seats;

    if (currentSeats[seatKey]) {
      delete currentSeats[seatKey];
    } else {
      currentSeats[seatKey] = {
        seatNumber: parseInt(seatKey.replace("-", ""), 10),
        isAvailable: true,
        isBooked: false,
      };
    }

    updatedScreens[screenIndex].seats = currentSeats;
    setScreens(updatedScreens);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedScreens = screens.map((screen) => {
      const seatObjects = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 12; col++) {
          const seatKey = `${row}-${col}`;
          const seat = screen.seats[seatKey] || {
            seatNumber: parseInt(seatKey.replace("-", ""), 10),
            isAvailable: false,
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

      console.log("Theatre Submitted:", processedScreens);
    } catch (error) {
      console.error("Error submitting theatre:", error);
    }
  };

  return (
    <FormContainer style={{ marginTop: "-611px", marginLeft: "200px" }}>
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
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
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
                type="text"
                style={{ width: "15%" }}
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
  );
}

export default TheatreAddScreen;